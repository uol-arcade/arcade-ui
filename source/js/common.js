
Math.clamp = (x, a, b) =>
{
    return Math.max(a, Math.min(x, b));
};

Math.randomRange = (a, b) =>
{
    return a + Math.random() * (b - a);
};