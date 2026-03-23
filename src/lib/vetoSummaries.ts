/**
 * Brief summaries for each SC veto record since 1992 (DPPA dataset IDs).
 * Keyed by the `id` field in DPPA-SCVETOES.json.
 */
export const VETO_SUMMARIES: Record<number, string> = {
  // 2025
  1: 'US veto on a draft calling for an immediate and unconditional ceasefire in Gaza and demanding the release of all hostages and detainees.',
  2: 'US veto on a draft demanding an immediate ceasefire in Gaza and emphasising the protection of civilians amid the ongoing conflict.',
  3: 'Russian veto (one of two at the same meeting) on a draft calling for the withdrawal of Russian forces from Ukraine on the third anniversary of the full-scale invasion.',
  4: 'Russian veto (one of two at the same meeting) on a companion draft reaffirming the territorial integrity of Ukraine and demanding a ceasefire.',

  // 2024
  5: 'US veto on an Arab-backed draft demanding an immediate and permanent ceasefire in Gaza and condemning attacks on civilians and civilian infrastructure.',
  6: 'Russian veto blocking renewal of the Sudan sanctions monitoring panel, effectively ending international oversight of the arms embargo on Sudan.',
  7: 'Russian veto on a US-sponsored draft resolution addressing the placement of nuclear weapons in outer space, framed as a non-proliferation matter.',
  8: 'US veto on a draft recommending Palestine for full UN membership, blocking the Palestinian Authority\'s renewed bid to become a full UN member state.',
  9: 'Russian veto ending the mandate of the Panel of Experts monitoring UN sanctions on North Korea, dismantling a key enforcement mechanism.',
  10: 'Double veto by Russia and China on a US-led draft demanding an immediate humanitarian ceasefire in Gaza and unimpeded access for humanitarian aid.',
  11: 'US veto on an Algerian-sponsored draft demanding an immediate humanitarian ceasefire in Gaza, citing concern that it would undermine ongoing hostage negotiations.',

  // 2023
  12: 'US veto of an oral amendment to a Security Council resolution on Gaza that would have added language calling for an immediate humanitarian ceasefire.',
  13: 'US veto on an Arab-backed draft calling for an immediate humanitarian ceasefire in Gaza, the protection of civilians, and a pause in hostilities.',
  14: 'Double veto by Russia and China on a Western-backed draft condemning Hamas\'s 7 October attacks and calling for protected humanitarian corridors in Gaza.',
  15: 'US veto on a Brazilian-drafted resolution calling for humanitarian pauses in Gaza to allow aid delivery and civilian protection, days after the 7 October attacks.',
  16: 'Russian veto blocking renewal of MINUSMA, the UN peacekeeping mission in Mali, after the Malian military junta requested its withdrawal.',
  17: 'Russian veto on renewal of authorisation for cross-border humanitarian aid deliveries to northwest Syria, effectively halting the Bab al-Hawa corridor.',

  // 2022
  18: 'Russian veto on a draft calling for an independent international commission to investigate alleged Russian war crimes and atrocities in Ukraine.',
  19: 'Russian veto on renewal of the authorisation for cross-border humanitarian aid access to Syria through the Bab al-Hawa border crossing.',
  20: 'Double veto by Russia and China on a US-led draft to tighten sanctions on North Korea following a series of intercontinental ballistic missile tests.',
  21: 'Russian veto on a draft condemning Russia\'s full-scale military invasion of Ukraine and demanding the immediate withdrawal of all Russian forces.',

  // 2021
  22: 'Russian veto on a draft resolution under the broad agenda of international peace and security, related to the deteriorating situation and human rights in Myanmar following the February 2021 military coup.',

  // 2020
  23: 'US veto on a draft demanding a 30-day ceasefire in Yemen and urging all parties to engage in UN-led peace negotiations, citing procedural objections.',
  24: 'Double veto by Russia and China (first of two on the same day) blocking a draft to extend cross-border humanitarian aid to Syria through multiple border crossings.',
  25: 'Double veto by Russia and China (second of two on the same day) blocking a compromise draft that would have maintained at least one border crossing for humanitarian aid to Syria.',

  // 2019
  26: 'Double veto by Russia and China on a Western-backed draft calling for cross-border humanitarian aid deliveries to northwest Syria amid the Idlib offensive.',
  27: 'Double veto by Russia and China on a draft extending the mandate for cross-border and cross-line humanitarian aid to Syria.',
  28: 'Double veto by Russia and China on a draft calling for new presidential elections in Venezuela and recognising Juan Guaidó\'s claim to the interim presidency.',

  // 2018
  29: 'US veto on a Kuwaiti-sponsored draft condemning Israeli use of force against Palestinian civilians during the Great March of Return protests in Gaza.',
  30: 'Russian veto on a US-UK-French draft establishing an independent mechanism to investigate chemical weapons use in Syria, following the April 2018 Douma attack.',
  31: 'Russian veto on a draft to extend the mandate of the Joint Investigative Mechanism (JIM) probing chemical weapons attacks in Syria.',

  // 2017
  32: 'US veto on an Egyptian-drafted resolution declaring null and void any action altering the legal status, demographic composition, or character of Jerusalem.',
  33: 'Russian veto on a draft condemning the Syrian government\'s use of chemical weapons in the Khan Shaykhun attack and demanding accountability.',
  34: 'Russian veto on a draft establishing an independent investigative body on chemical weapons use in Syria after Russia blocked renewal of the JIM.',
  35: 'Russian veto on a draft demanding a 30-day humanitarian ceasefire in Syria to allow aid delivery and evacuation of civilians.',
  36: 'Russian veto on a draft demanding a seven-day ceasefire in Syria\'s Eastern Ghouta region to allow humanitarian access and medical evacuations.',
  37: 'Double veto by Russia and China on a draft imposing targeted sanctions on Syrian officials and entities responsible for chemical weapons attacks.',

  // 2016
  38: 'Double veto by Russia and China on a French-drafted resolution demanding a ceasefire in Aleppo and unimpeded humanitarian access to the besieged city.',
  39: 'Russian veto on a draft demanding a ceasefire in Aleppo to halt the offensive by Syrian government forces and their allies.',

  // 2015
  40: 'Russian veto on a Malaysian-drafted resolution establishing an international tribunal to prosecute those responsible for shooting down Malaysia Airlines flight MH17 over eastern Ukraine.',
  41: 'Russian veto on a draft declaring the 1995 Srebrenica massacre a genocide and condemning attempts to deny or glorify it.',

  // 2014
  42: 'Double veto by Russia and China on a Western-backed draft to refer the situation in Syria to the International Criminal Court.',
  43: 'Russian veto on a draft declaring the Crimea referendum of March 2014 invalid under international law and reaffirming Ukraine\'s territorial integrity.',

  // 2012
  44: 'Double veto by Russia and China on a Western-backed draft demanding a political transition in Syria and calling on President Assad to step down.',
  45: 'Double veto by Russia and China on a draft condemning Syrian government violence against civilians and demanding a halt to military operations in cities.',

  // 2011
  46: 'Double veto by Russia and China on a Western-drafted resolution condemning the Syrian government\'s violent crackdown on pro-democracy protesters.',
  47: 'US veto on a draft demanding that Israel immediately halt all settlement activity in the occupied Palestinian territories.',

  // 2009
  48: 'Russian veto blocking renewal of the UN Observer Mission in Georgia (UNOMIG), which had monitored the ceasefire since the 1992–93 war. Russia objected following the 2008 Russia-Georgia war over South Ossetia.',

  // 2008
  49: 'Double veto by Russia and China on a draft imposing targeted sanctions—asset freezes and travel bans—on Zimbabwean President Robert Mugabe and senior officials over political violence and election irregularities.',

  // 2007
  50: 'Double veto by Russia and China on a US-UK-France draft calling on Myanmar\'s military junta to release political prisoners, including Aung San Suu Kyi, and begin a democratic transition.',

  // 2006
  51: 'US veto on a Qatar-sponsored draft demanding that Israel immediately halt its military operation in Gaza (Operation Autumn Clouds) following the killing of civilians in Beit Hanoun.',
  52: 'US veto on a draft demanding that Israel immediately cease its military offensive in Gaza (Operation Summer Rains) and withdraw Israeli forces.',

  // 2004
  53: 'US veto on a draft condemning Israeli military operations in Rafah, southern Gaza, and demanding the cessation of demolition of Palestinian homes.',
  54: 'Russian veto on a draft to extend the UN Peacekeeping Force in Cyprus (UNFICYP) mandate under terms that would have supported the failed Annan Plan for reunification.',
  55: 'US veto on a draft condemning the Israeli targeted killing of Hamas founder Sheikh Ahmed Yassin and calling on Israel to respect international humanitarian law.',

  // 2003
  56: 'US veto on a draft condemning construction of the Israeli separation barrier in the West Bank and demanding its dismantlement.',
  57: 'US veto on a draft calling on Israel to halt extrajudicial killings of Palestinians, including the killing of a UN envoy, and to end military incursions into Gaza.',

  // 2002
  58: 'US veto on a draft calling for international observers to be deployed to Jenin and the occupied Palestinian territories following the Israeli Operation Defensive Shield.',
  59: 'US veto on a draft that would have continued the UN Mission in Bosnia (UNMIBH) without granting US personnel immunity from ICC jurisdiction, amid a US campaign to exempt peacekeepers from the Rome Statute.',

  // 2001
  60: 'US veto on a draft to establish a UN observer force to protect Palestinian civilians in the occupied territories during the Second Intifada.',
  61: 'US veto on a draft condemning ongoing Israeli settlement construction in the occupied Palestinian territories and calling for an immediate freeze.',

  // 1999
  62: 'Chinese veto blocking renewal of the UN Preventive Deployment Force (UNPREDEP) in Macedonia. China objected to Macedonia\'s diplomatic recognition of Taiwan.',

  // 1997
  63: 'US veto on a draft calling on Israel to immediately halt construction of a new settlement (Har Homa/Jabal Abu Ghneim) in East Jerusalem.',
  64: 'US veto on a draft condemning Israeli settlement construction in East Jerusalem and demanding compliance with international law and previous resolutions.',
  65: 'Chinese veto blocking expansion of the UN Human Rights Verification Mission in Guatemala (MINUGUA). China objected to Guatemala\'s recognition of Taiwan.',

  // 1996
  66: 'US veto blocking the reappointment of Boutros Boutros-Ghali for a second term as UN Secretary-General, preferring a more reform-minded candidate; he remains the only Secretary-General denied a second term.',

  // 1995
  67: 'US veto on a draft calling on Israel to rescind a decision to confiscate Palestinian-owned land in East Jerusalem for settlement expansion.',

  // 1994
  68: 'Russian veto on a draft to lift the arms embargo on the Bosnian government, which the US and others argued was needed to allow Bosnia to defend itself against Serb forces.',

  // 1993
  69: 'Russian veto on a draft to continue and expand the UN Peacekeeping Force in Cyprus (UNFICYP), objecting to the mandate\'s terms related to the island\'s divided status.',
};
