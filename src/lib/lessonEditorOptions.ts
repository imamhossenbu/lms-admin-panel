import type { LessonEditorOption } from "@/types/lessonEditor";

/** ISO 3166-1 alpha-2 codes; names come from the browser (Intl.DisplayNames, English). */
const COUNTRY_CODES =
  "AD AE AF AG AI AL AM AO AR AT AU AW AZ BA BB BD BE BF BG BH BI BJ BM BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GW GY HK HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MH MK ML MM MN MO MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PG PH PK PL PR PS PT PW PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VN VU WS XK YE ZA ZM ZW".split(
    " "
  );

function countryOptions(): LessonEditorOption[] {
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    names = null;
  }
  return COUNTRY_CODES.map((code) => ({ value: code, label: names?.of(code) ?? code })).sort((a, b) => a.label.localeCompare(b.label));
}

/** Countries for the lesson's geographic restriction (A→Z). */
export const LESSON_COUNTRY_OPTIONS: LessonEditorOption[] = countryOptions();

/** Languages offered for lesson subtitles. */
export const SUBTITLE_LANGUAGE_OPTIONS: LessonEditorOption[] = ["English", "Bangla", "Hindi", "Urdu", "Arabic", "Spanish", "French", "German", "Portuguese", "Chinese", "Japanese", "Indonesian", "Malay", "Turkish"].map((l) => ({
  value: l,
  label: l,
}));
