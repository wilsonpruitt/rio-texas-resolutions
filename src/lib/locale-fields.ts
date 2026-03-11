/**
 * Read the locale-appropriate field from a bilingual record.
 * Falls back to English if the translated field is empty.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function localizedField(
  obj: any,
  field: string,
  locale: string
): string {
  const localeKey = `${field}_${locale.toLowerCase()}`;
  const fallbackKey = `${field}_en`;
  return (obj[localeKey] as string) ?? (obj[fallbackKey] as string) ?? "";
}
