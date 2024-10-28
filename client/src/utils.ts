export function parseLocalizedNumber(n: string, locale?: string): number {
    const thousandSeparator = Intl.NumberFormat(locale).formatToParts(11111)[1].value;
    const decimalSeparator = Intl.NumberFormat(locale).formatToParts(1.1)[1].value;
    return parseFloat(n
        .replaceAll(thousandSeparator, '')
        .replaceAll(decimalSeparator, '.')
    );
}
