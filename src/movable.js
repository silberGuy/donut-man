export function decorate(object) {
    return Object.assign(object, {
            velocity: {
                x: 0,
                y: 0,
                z: 0,
            },
            accelaration: {
                x: 0,
                y: 0,
                z: 0,
            },
            animate,
        });
};

function animate() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;
    this.velocity.x += this.accelaration.x;
    this.velocity.y += this.accelaration.y;
    this.velocity.z += this.accelaration.z;
}
