// Procedural Animation System - Distance Constraints & IK
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
    }

    update() {
        this.prevX = this.x;
        this.prevY = this.y;
    }
}

class Segment {
    constructor(x, y, length, width) {
        this.point = new Point(x, y);
        this.length = length;
        this.width = width;
        this.angle = 0;
    }

    follow(targetX, targetY) {
        const dx = targetX - this.point.x;
        const dy = targetY - this.point.y;
        const angle = Math.atan2(dy, dx);

        this.angle = angle;
        this.point.x = targetX - Math.cos(angle) * this.length;
        this.point.y = targetY - Math.sin(angle) * this.length;
    }

    setPosition(x, y) {
        this.point.x = x;
        this.point.y = y;
    }

    getEndPoint() {
        const endX = this.point.x + Math.cos(this.angle) * this.length;
        const endY = this.point.y + Math.sin(this.angle) * this.length;
        return { x: endX, y: endY };
    }
}

class ProceduralCreature {
    constructor(x, y, segmentCount, segmentLength, type = 'fish') {
        this.segments = [];
        this.segmentCount = segmentCount;
        this.type = type;
        this.targetX = x;
        this.targetY = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 1;
        this.swimPhase = Math.random() * Math.PI * 2;
        this.swimSpeed = 0.05;
        this.maxAngleDelta = Math.PI / 6; // Angle constraint

        // Color based on type - brighter, more vibrant
        const fishColors = [
            `rgba(0, 229, 255, 0.85)`,     // Cyan
            `rgba(255, 100, 180, 0.85)`,   // Pink
            `rgba(150, 80, 255, 0.85)`,    // Purple
            `rgba(100, 255, 200, 0.85)`,   // Aqua
        ];

        if (type === 'fish') {
            this.color = fishColors[Math.floor(Math.random() * fishColors.length)];
        } else {
            this.color = `rgba(255, 0, 110, 0.75)`;
        }

        // Initialize segments
        for (let i = 0; i < segmentCount; i++) {
            const width = this.getSegmentWidth(i / segmentCount);
            this.segments.push(new Segment(
                x - i * segmentLength,
                y,
                segmentLength,
                width
            ));
        }
    }

    getSegmentWidth(t) {
        // Parametric width - fish body shape
        if (this.type === 'fish') {
            // More realistic fish shape: rounder head, tapered tail
            if (t < 0.2) {
                // Head area - rounded
                return 12 + 8 * (t / 0.2);
            } else if (t < 0.7) {
                // Body - thick middle
                const bodyT = (t - 0.2) / 0.5;
                return 20 - 5 * bodyT;
            } else {
                // Tail - rapid taper
                const tailT = (t - 0.7) / 0.3;
                return 15 * (1 - tailT);
            }
        } else {
            // Jellyfish - bell shape
            return 15 * (1 - t) * (1 - t);
        }
    }

    update(targetX, targetY, deltaTime = 1) {
        this.swimPhase += this.swimSpeed;

        // Smooth movement toward target
        const dx = targetX - this.segments[0].point.x;
        const dy = targetY - this.segments[0].point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            this.velocityX += (dx / distance) * this.speed * 0.1;
            this.velocityY += (dy / distance) * this.speed * 0.1;
        }

        // Add swimming oscillation
        const perpX = -Math.sin(Math.atan2(dy, dx));
        const perpY = Math.cos(Math.atan2(dy, dx));
        const swimOffset = Math.sin(this.swimPhase) * 2;

        this.velocityX += perpX * swimOffset * 0.05;
        this.velocityY += perpY * swimOffset * 0.05;

        // Damping
        this.velocityX *= 0.95;
        this.velocityY *= 0.95;

        // Update head position
        this.segments[0].point.x += this.velocityX;
        this.segments[0].point.y += this.velocityY;

        // FABRIK - Forward reaching
        for (let i = 1; i < this.segments.length; i++) {
            const prev = this.segments[i - 1];
            const end = prev.getEndPoint();
            this.segments[i].follow(end.x, end.y);
        }

        // Apply angle constraints to prevent sharp bends
        for (let i = 1; i < this.segments.length; i++) {
            const prev = this.segments[i - 1];
            const curr = this.segments[i];

            let angleDiff = curr.angle - prev.angle;

            // Normalize angle difference to -PI to PI
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            // Constrain the angle
            if (Math.abs(angleDiff) > this.maxAngleDelta) {
                curr.angle = prev.angle + Math.sign(angleDiff) * this.maxAngleDelta;
            }
        }
    }

    getTotalCurvature() {
        let totalCurvature = 0;
        for (let i = 1; i < this.segments.length; i++) {
            let angleDiff = this.segments[i].angle - this.segments[i - 1].angle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            totalCurvature += Math.abs(angleDiff);
        }
        return totalCurvature;
    }

    draw(ctx) {
        const curvature = this.getTotalCurvature();

        if (this.type === 'fish') {
            this.drawFish(ctx, curvature);
        } else if (this.type === 'jellyfish') {
            this.drawJellyfish(ctx);
        }
    }

    drawFish(ctx, curvature) {
        // Generate smooth body outline
        const leftPoints = [];
        const rightPoints = [];

        for (let i = 0; i < this.segments.length; i++) {
            const seg = this.segments[i];
            const perpAngle = seg.angle + Math.PI / 2;
            const width = seg.width;

            leftPoints.push({
                x: seg.point.x + Math.cos(perpAngle) * width,
                y: seg.point.y + Math.sin(perpAngle) * width
            });

            rightPoints.push({
                x: seg.point.x - Math.cos(perpAngle) * width,
                y: seg.point.y - Math.sin(perpAngle) * width
            });
        }

        // Draw main body with gradient
        ctx.save();

        ctx.beginPath();
        ctx.moveTo(leftPoints[0].x, leftPoints[0].y);

        // Smooth curves using quadratic curves
        for (let i = 1; i < leftPoints.length - 1; i++) {
            const xc = (leftPoints[i].x + leftPoints[i + 1].x) / 2;
            const yc = (leftPoints[i].y + leftPoints[i + 1].y) / 2;
            ctx.quadraticCurveTo(leftPoints[i].x, leftPoints[i].y, xc, yc);
        }
        ctx.lineTo(leftPoints[leftPoints.length - 1].x, leftPoints[leftPoints.length - 1].y);

        for (let i = rightPoints.length - 1; i > 0; i--) {
            const xc = (rightPoints[i].x + rightPoints[i - 1].x) / 2;
            const yc = (rightPoints[i].y + rightPoints[i - 1].y) / 2;
            ctx.quadraticCurveTo(rightPoints[i].x, rightPoints[i].y, xc, yc);
        }

        ctx.closePath();

        // Fill body
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add lighter belly
        const gradient = ctx.createLinearGradient(
            leftPoints[0].x, leftPoints[0].y,
            rightPoints[0].x, rightPoints[0].y
        );
        gradient.addColorStop(0, this.color.replace('0.7', '0.5'));
        gradient.addColorStop(0.5, this.color.replace('0.7', '0.8'));
        gradient.addColorStop(1, this.color.replace('0.7', '0.5'));
        ctx.fillStyle = gradient;
        ctx.fill();

        // Outline
        ctx.strokeStyle = this.color.replace('0.7', '1');
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // Draw fins BEFORE body so they appear behind
        this.drawPectoralFins(ctx, curvature);
        this.drawDorsalFin(ctx, curvature);
        this.drawTailFin(ctx);

        // Draw eye
        const head = this.segments[0];
        const eyeX = head.point.x + Math.cos(head.angle) * head.length * 0.6;
        const eyeY = head.point.y + Math.sin(head.angle) * head.length * 0.6;

        // Eye white
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Pupil
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fill();
    }

    drawJellyfish(ctx) {
        // Generate body outline
        const leftPoints = [];
        const rightPoints = [];

        for (let i = 0; i < this.segments.length; i++) {
            const seg = this.segments[i];
            const perpAngle = seg.angle + Math.PI / 2;
            const width = seg.width;

            leftPoints.push({
                x: seg.point.x + Math.cos(perpAngle) * width,
                y: seg.point.y + Math.sin(perpAngle) * width
            });

            rightPoints.push({
                x: seg.point.x - Math.cos(perpAngle) * width,
                y: seg.point.y - Math.sin(perpAngle) * width
            });
        }

        // Draw bell
        ctx.beginPath();
        ctx.moveTo(leftPoints[0].x, leftPoints[0].y);

        for (let i = 1; i < leftPoints.length; i++) {
            ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
        }

        for (let i = rightPoints.length - 1; i >= 0; i--) {
            ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
        }

        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = this.color.replace('0.7', '0.9');
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw tentacles
        this.drawTentacles(ctx);
    }

    drawDorsalFin(ctx, curvature) {
        // Dorsal fin on top of fish
        const finSegmentIndex = Math.floor(this.segments.length * 0.4);
        const seg = this.segments[finSegmentIndex];

        const finOffset = curvature * 8;
        const perpAngle = seg.angle + Math.PI / 2;

        const finBase1X = seg.point.x + Math.cos(perpAngle) * seg.width * 0.8;
        const finBase1Y = seg.point.y + Math.sin(perpAngle) * seg.width * 0.8;

        const finBase2X = seg.point.x + Math.cos(perpAngle) * seg.width * 0.8 + Math.cos(seg.angle) * 15;
        const finBase2Y = seg.point.y + Math.sin(perpAngle) * seg.width * 0.8 + Math.sin(seg.angle) * 15;

        const finTipX = finBase1X + Math.cos(perpAngle) * (18 + finOffset) + Math.cos(seg.angle) * 8;
        const finTipY = finBase1Y + Math.sin(perpAngle) * (18 + finOffset) + Math.sin(seg.angle) * 8;

        ctx.beginPath();
        ctx.moveTo(finBase1X, finBase1Y);
        ctx.lineTo(finTipX, finTipY);
        ctx.lineTo(finBase2X, finBase2Y);
        ctx.closePath();
        ctx.fillStyle = this.color.replace('0.7', '0.4');
        ctx.fill();
        ctx.strokeStyle = this.color.replace('0.7', '0.8');
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    drawPectoralFins(ctx, curvature) {
        // Side fins near the head
        const finSegment = this.segments[Math.floor(this.segments.length * 0.2)];
        const perpAngle = finSegment.angle + Math.PI / 2;

        // Left pectoral fin
        const leftFinBaseX = finSegment.point.x + Math.cos(perpAngle) * finSegment.width * 0.6;
        const leftFinBaseY = finSegment.point.y + Math.sin(perpAngle) * finSegment.width * 0.6;

        ctx.beginPath();
        ctx.moveTo(leftFinBaseX, leftFinBaseY);
        ctx.lineTo(
            leftFinBaseX + Math.cos(perpAngle + Math.PI / 4) * 15,
            leftFinBaseY + Math.sin(perpAngle + Math.PI / 4) * 15
        );
        ctx.lineTo(
            leftFinBaseX + Math.cos(finSegment.angle - Math.PI / 6) * 12,
            leftFinBaseY + Math.sin(finSegment.angle - Math.PI / 6) * 12
        );
        ctx.closePath();
        ctx.fillStyle = this.color.replace('0.7', '0.35');
        ctx.fill();
        ctx.strokeStyle = this.color.replace('0.7', '0.7');
        ctx.lineWidth = 1;
        ctx.stroke();

        // Right pectoral fin
        const rightFinBaseX = finSegment.point.x - Math.cos(perpAngle) * finSegment.width * 0.6;
        const rightFinBaseY = finSegment.point.y - Math.sin(perpAngle) * finSegment.width * 0.6;

        ctx.beginPath();
        ctx.moveTo(rightFinBaseX, rightFinBaseY);
        ctx.lineTo(
            rightFinBaseX - Math.cos(perpAngle + Math.PI / 4) * 15,
            rightFinBaseY - Math.sin(perpAngle + Math.PI / 4) * 15
        );
        ctx.lineTo(
            rightFinBaseX + Math.cos(finSegment.angle - Math.PI / 6) * 12,
            rightFinBaseY + Math.sin(finSegment.angle - Math.PI / 6) * 12
        );
        ctx.closePath();
        ctx.fillStyle = this.color.replace('0.7', '0.35');
        ctx.fill();
        ctx.strokeStyle = this.color.replace('0.7', '0.7');
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    drawTailFin(ctx) {
        // Caudal (tail) fin
        const tail = this.segments[this.segments.length - 1];
        const tailEnd = tail.getEndPoint();

        // Forked tail fin
        ctx.beginPath();
        ctx.moveTo(tailEnd.x, tailEnd.y);

        // Upper fork
        ctx.lineTo(
            tailEnd.x + Math.cos(tail.angle + Math.PI / 5) * 25,
            tailEnd.y + Math.sin(tail.angle + Math.PI / 5) * 25
        );
        ctx.lineTo(
            tailEnd.x + Math.cos(tail.angle + Math.PI / 8) * 18,
            tailEnd.y + Math.sin(tail.angle + Math.PI / 8) * 18
        );

        // Center notch
        ctx.lineTo(
            tailEnd.x + Math.cos(tail.angle) * 15,
            tailEnd.y + Math.sin(tail.angle) * 15
        );

        // Lower fork
        ctx.lineTo(
            tailEnd.x + Math.cos(tail.angle - Math.PI / 8) * 18,
            tailEnd.y + Math.sin(tail.angle - Math.PI / 8) * 18
        );
        ctx.lineTo(
            tailEnd.x + Math.cos(tail.angle - Math.PI / 5) * 25,
            tailEnd.y + Math.sin(tail.angle - Math.PI / 5) * 25
        );

        ctx.closePath();
        ctx.fillStyle = this.color.replace('0.7', '0.6');
        ctx.fill();
        ctx.strokeStyle = this.color.replace('0.7', '1');
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawTentacles(ctx) {
        const tail = this.segments[this.segments.length - 1];
        const tailEnd = tail.getEndPoint();
        const tentacleCount = 5;

        for (let i = 0; i < tentacleCount; i++) {
            const angle = tail.angle + (i - tentacleCount / 2) * 0.3;
            const tentacleLength = 30 + Math.sin(this.swimPhase + i) * 5;

            ctx.beginPath();
            ctx.moveTo(tailEnd.x, tailEnd.y);

            for (let j = 0; j <= 5; j++) {
                const t = j / 5;
                const waveOffset = Math.sin(this.swimPhase * 2 + i + t * Math.PI) * 5;
                const x = tailEnd.x + Math.cos(angle) * tentacleLength * t + Math.cos(angle + Math.PI / 2) * waveOffset;
                const y = tailEnd.y + Math.sin(angle) * tentacleLength * t + Math.sin(angle + Math.PI / 2) * waveOffset;
                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = this.color.replace('0.7', '0.6');
            ctx.lineWidth = 3 * (1 - i / tentacleCount);
            ctx.stroke();
        }
    }
}

class CreatureCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.creatures = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isRunning = false;

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Track mouse for interactive following
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    addCreature(type = 'fish') {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        // More segments for smoother fish (12 segments, 12px each)
        const creature = new ProceduralCreature(x, y, 12, 12, type);
        creature.speed = 0.5 + Math.random() * 1;
        this.creatures.push(creature);
    }

    animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw all creatures
        for (let creature of this.creatures) {
            // Each creature follows a wandering path
            const time = Date.now() * 0.0005;
            const targetX = this.canvas.width / 2 + Math.cos(time + creature.swimPhase) * this.canvas.width * 0.3;
            const targetY = this.canvas.height / 2 + Math.sin(time * 0.7 + creature.swimPhase) * this.canvas.height * 0.3;

            creature.update(targetX, targetY);
            creature.draw(this.ctx);
        }

        requestAnimationFrame(() => this.animate());
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const heroCanvas = new CreatureCanvas('heroCreatures');

    // Add various creatures
    for (let i = 0; i < 3; i++) {
        heroCanvas.addCreature('fish');
    }
    for (let i = 0; i < 2; i++) {
        heroCanvas.addCreature('jellyfish');
    }

    heroCanvas.start();
});
