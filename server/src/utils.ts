export const KIRUNA_COORDS: [number, number] = [20.26, 67.845];

function deg2rad(p: number): number {
    return p * (Math.PI / 180);
}

/**
 * Computes the distance between two points
 * @param p1 Tuple containing [latitude, longitude], in degrees
 * @param p2 Tuple containing [latitude, longitude], in degrees
 * @returns The distance between the points, in Km
 */
export function coordDistance(p1: [number, number], p2: [number, number]): number {
    p1 = [deg2rad(p1[0]), deg2rad(p2[1])];
    p2 = [deg2rad(p2[0]), deg2rad(p2[1])];

    return 6371 * Math.acos(
        Math.sin(p1[0]) * Math.sin(p2[0]) + Math.cos(p1[0]) *
        Math.cos(p2[0]) * Math.cos(p2[1] - p1[1])
    );
}