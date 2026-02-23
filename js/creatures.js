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

        // Color based on type
        this.color = type === 'fish'
            ? `rgba(0, 229, 255, 0.7)`
            : type === 'jellyfish'
            ? `rgba(255, 0, 110, 0.7)`
            : `rgba(123, 44, 191, 0.7)`;

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
        // Parametric width - wider in middle, tapered at ends
        if (this.type === 'fish') {
            return 20 * Math.sin(t * Math.PI);
        } else {
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

        // Draw body
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

        // Draw eye
        const head = this.segments[0];
        const eyeOffset = head.width * 0.5;
        const eyeX = head.point.x + Math.cos(head.angle) * head.length * 0.7;
        const eyeY = head.point.y + Math.sin(head.angle) * head.length * 0.7;

        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();

        // Draw fins (responsive to curvature)
        if (this.type === 'fish') {
            this.drawFins(ctx, curvature);
        } else if (this.type === 'jellyfish') {
            this.drawTentacles(ctx);
        }
    }

    drawFins(ctx, curvature) {
        const finSegmentIndex = Math.floor(this.segments.length / 3);
        const seg = this.segments[finSegmentIndex];

        // Dorsal fin offset based on curvature
        const finOffset = curvature * 10;
        const perpAngle = seg.angle + Math.PI / 2;

        const finBaseX = seg.point.x + Math.cos(perpAngle) * seg.width;
        const finBaseY = seg.point.y + Math.sin(perpAngle) * seg.width;

        const finTipX = finBaseX + Math.cos(perpAngle) * (15 + finOffset);
        const finTipY = finBaseY + Math.sin(perpAngle) * (15 + finOffset);

        ctx.beginPath();
        ctx.moveTo(finBaseX, finBaseY);
        ctx.lineTo(finTipX, finTipY);
        ctx.lineTo(finBaseX + Math.cos(seg.angle) * 10, finBaseY + Math.sin(seg.angle) * 10);
        ctx.closePath();
        ctx.fillStyle = this.color.replace('0.7', '0.5');
        ctx.fill();
        ctx.strokeStyle = this.color.replace('0.7', '0.8');
        ctx.lineWidth = 1;
        ctx.stroke();

        // Tail fin
        const tail = this.segments[this.segments.length - 1];
        const tailEnd = tail.getEndPoint();
        const tailPerpAngle = tail.angle + Math.PI / 2;

        ctx.beginPath();
        ctx.moveTo(tailEnd.x, tailEnd.y);
        ctx.lineTo(
            tailEnd.x + Math.cos(tail.angle + Math.PI / 6) * 20,
            tailEnd.y + Math.sin(tail.angle + Math.PI / 6) * 20
        );
        ctx.lineTo(
            tailEnd.x + Math.cos(tail.angle - Math.PI / 6) * 20,
            tailEnd.y + Math.sin(tail.angle - Math.PI / 6) * 20
        );
        ctx.closePath();
        ctx.fillStyle = this.color.replace('0.7', '0.6');
        ctx.fill();
        ctx.strokeStyle = this.color.replace('0.7', '0.9');
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
        const creature = new ProceduralCreature(x, y, 8, 15, type);
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
