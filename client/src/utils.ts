export function parseLocalizedNumber(n: string, locale?: string): number {
    const thousandSeparator = Intl.NumberFormat(locale).formatToParts(11111)[1].value;
    const decimalSeparator = Intl.NumberFormat(locale).formatToParts(1.1)[1].value;
    return parseFloat(n
        .replaceAll(thousandSeparator, '')
        .replaceAll(decimalSeparator, '.')
    );
}

export function pageRangeToString(pr: PageRange[] | undefined): string {
    if (pr === undefined)
        return "";
    return pr.map<string>(p => {
        if (typeof p === "number") {
            return p.toString();
        } else {
            return p.join("-");
        }
    }).join(",");
}

export function validatePageRangeString(pr: string): PageRange[] | undefined {
    if (pr.length === 0)
        return [];

    const tmpRanges = pr.replaceAll(" ", "").split(",")
    let ranges: PageRange[] = [];
    for (const r of tmpRanges) {
        const tmpRange = r.split("-");
        if (tmpRange.length > 2 || !tmpRange.every(r => r.length > 0))
            return undefined;

        const first = Number(tmpRange.at(0));
        if (Number.isNaN(first) || !Number.isInteger(first))
            return undefined;

        if (tmpRange.length === 1) {
            ranges.push(first);
            continue;
        }

        const second = Number(tmpRange.at(1));
        if (Number.isNaN(second) || !Number.isInteger(second))
            return undefined;

        ranges.push([first, second]);
    }
    return ranges;
}

function deg2rad(p: number): number {
    return p * (Math.PI / 180);
}

/**
 * Computes the distance between two points
 * @param p1 Tuple containing [latitude, longitude], in degrees
 * @param p2 Tuple containing [latitude, longitude], in degrees
 * @returns The distance between the points, in Km
 */

export type PageRange = [number, number] | number;
