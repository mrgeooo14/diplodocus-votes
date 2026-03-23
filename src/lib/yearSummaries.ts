export interface KeyResolution {
  /** Resolution symbol used for data lookup (e.g. "S/RES/2728", "A/RES/70/1") */
  symbol: string;
  /** Short one-line label shown in the UI */
  label: string;
}

export interface YearSummary {
  headline: string;
  body: string;
  keyResolutions?: KeyResolution[];
}

/**
 * Year summaries keyed by body (e.g. "GA", "SC") then year.
 * Add a new top-level key for any future body; YearContext will pick it up automatically.
 */
export const YEAR_SUMMARIES: Record<string, Record<number, YearSummary>> = {

  // ─── Security Council ─────────────────────────────────────────────────────
  SC: {
    1992: {
      headline: 'SC activism surges post-Cold War',
      body: 'The SC authorised more Chapter VII operations in 1992 than in the previous four decades combined. UNPROFOR deployed to Bosnia, UNITAF to Somalia, and UNTAC supervised Cambodia\'s transition. The Council began to redefine "threat to peace" to include humanitarian catastrophes.',
      keyResolutions: [
        { symbol: 'S/RES/770', label: 'Authorised force to deliver aid in Bosnia' },
        { symbol: 'S/RES/794', label: 'Authorised UNITAF in Somalia (Chapter VII)' },
      ],
    },
    1993: {
      headline: 'Somalia and Yugoslavia test SC limits',
      body: 'The Black Hawk Down disaster in Mogadishu exposed the limits of peace enforcement. The SC expanded UNPROFOR\'s mandate in Bosnia while ethnic cleansing continued. The ICTY was established — the first international criminal tribunal since Nuremberg.',
      keyResolutions: [
        { symbol: 'S/RES/837', label: 'Authorised action against Somali factions' },
        { symbol: 'S/RES/827', label: 'Established the ICTY' },
      ],
    },
    1994: {
      headline: "Rwanda genocide — SC's worst failure",
      body: 'Despite warnings from General Roméo Dallaire, the SC refused to reinforce UNAMIR as the Rwandan genocide killed ~800,000 in 100 days. France\'s Opération Turquoise was belatedly authorised. The SC later approved a US-led intervention to restore democracy in Haiti.',
      keyResolutions: [
        { symbol: 'S/RES/929', label: 'Authorised Opération Turquoise in Rwanda' },
        { symbol: 'S/RES/940', label: 'Authorised use of force to restore democracy in Haiti' },
      ],
    },
    1995: {
      headline: 'Srebrenica and Dayton',
      body: "The UN 'safe area' of Srebrenica fell to Bosnian Serb forces; over 8,000 Bosniaks were massacred. The SC's credibility was gravely damaged. NATO airstrikes and the Dayton Accords finally ended the Bosnian war; the SC authorised IFOR to implement the peace.",
      keyResolutions: [
        { symbol: 'S/RES/1031', label: 'Authorised NATO-led IFOR for Dayton implementation' },
        { symbol: 'S/RES/1019', label: 'Demanded access to Srebrenica and investigation of atrocities' },
      ],
    },
    1996: {
      headline: 'Angola, Iraq sanctions & SG succession',
      body: "The MPLA-UNITA ceasefire collapsed in Angola; UNAVEM III struggled. The SC expanded Iraq's oil-for-food programme. The US vetoed Boutros-Ghali's second term — he remains the only Secretary-General denied reappointment. Kofi Annan was elected as successor.",
      keyResolutions: [
        { symbol: 'S/RES/1055', label: 'Extended UNAVEM III mandate in Angola' },
        { symbol: 'S/RES/1060', label: 'Demanded Iraq cooperate with UNSCOM inspectors' },
      ],
    },
    1997: {
      headline: 'Congo, Albania and African crises',
      body: "Mobutu's Zaire collapsed; the SC debated intervention in the DRC. Albania descended into chaos over pyramid scheme collapses; the SC authorised a multinational protection force. West Africa's Liberia and Sierra Leone conflicts continued to challenge the Council.",
      keyResolutions: [
        { symbol: 'S/RES/1101', label: 'Authorised multinational protection force in Albania' },
        { symbol: 'S/RES/1125', label: 'Authorised ECOMOG in Sierra Leone' },
      ],
    },
    1998: {
      headline: 'Kosovo, Iraq and weapons inspections',
      body: "The SC demanded a Kosovo ceasefire and OSCE verifiers after Serb offensives, but Russia blocked enforcement. Iraq expelled UNSCOM inspectors; the US and UK launched Operation Desert Fox without SC authorisation. India and Pakistan conducted nuclear tests; the SC condemned both.",
      keyResolutions: [
        { symbol: 'S/RES/1199', label: 'Demanded ceasefire and OSCE access in Kosovo' },
        { symbol: 'S/RES/1203', label: 'Endorsed OSCE verification mission in Kosovo' },
      ],
    },
    1999: {
      headline: 'Kosovo bypasses SC; East Timor authorised',
      body: "NATO bombed Yugoslavia for 78 days after Russia threatened a veto on Kosovo. The SC later authorised KFOR (Res. 1244) post-conflict. In East Timor, pro-Indonesian militia violence followed the independence referendum; INTERFET was authorised — one of the SC's fastest crisis responses.",
      keyResolutions: [
        { symbol: 'S/RES/1244', label: 'Authorised KFOR and international presence in Kosovo' },
        { symbol: 'S/RES/1264', label: 'Authorised Australian-led INTERFET in East Timor' },
      ],
    },
    2000: {
      headline: 'Brahimi Report and Sierra Leone crisis',
      body: "The Brahimi Report exposed systemic failures in UN peacekeeping — understaffing, unclear mandates, inadequate force. UNAMSIL in Sierra Leone was briefly taken hostage by the RUF. Israel withdrew from Lebanon; the SC confirmed the line of withdrawal but Hezbollah remained.",
      keyResolutions: [
        { symbol: 'S/RES/1289', label: 'Expanded UNAMSIL mandate and force in Sierra Leone' },
        { symbol: 'S/RES/1315', label: 'Established the Special Court for Sierra Leone' },
      ],
    },
    2001: {
      headline: '9/11 and the counter-terrorism revolution',
      body: "The 11 September attacks produced near-unanimous SC solidarity. Resolution 1373 created binding counter-terrorism obligations on all UN members — a legislative act without precedent. The SC authorised ISAF for Afghanistan. The Counter-Terrorism Committee (CTC) was established.",
      keyResolutions: [
        { symbol: 'S/RES/1368', label: 'Recognised 9/11 as threat to peace; right of self-defence' },
        { symbol: 'S/RES/1373', label: 'Binding counter-terrorism framework on all member states' },
      ],
    },
    2002: {
      headline: 'Iraq: final warning and SC fracture',
      body: "The SC unanimously passed Res. 1441 giving Iraq a 'final opportunity' to disarm. Chief inspector Hans Blix reported incomplete compliance but urged more time. The US and UK pushed for a second resolution authorising force; France, Russia, and China threatened vetoes — ultimately no authorisation was sought.",
      keyResolutions: [
        { symbol: 'S/RES/1441', label: 'Gave Iraq a final opportunity to comply with disarmament' },
        { symbol: 'S/RES/1422', label: 'Exempted UN peacekeepers from ICC jurisdiction (US demand)' },
      ],
    },
    2003: {
      headline: 'Iraq war — SC authority at its lowest',
      body: "The US-led invasion of Iraq proceeded without SC authorisation, the deepest rupture between Washington and the Council since the UN's founding. The Canal Hotel bombing killed 22 UN staff. The SC tried to re-engage post-war but legitimacy was damaged. The Oil-for-Food scandal began surfacing.",
      keyResolutions: [
        { symbol: 'S/RES/1483', label: 'Recognised US/UK as occupying powers; post-war role' },
        { symbol: 'S/RES/1511', label: 'Authorised multinational force in Iraq' },
      ],
    },
    2004: {
      headline: 'Darfur emergency',
      body: "The SC declared Darfur a humanitarian emergency and threatened Sudan with sanctions. Khartoum resisted international peacekeeping. The December Indian Ocean tsunami prompted UN emergency coordination. The Volcker inquiry into the Oil-for-Food scandal intensified, implicating senior UN officials.",
      keyResolutions: [
        { symbol: 'S/RES/1564', label: 'Threatened sanctions if Sudan did not curb Darfur violence' },
        { symbol: 'S/RES/1572', label: 'Imposed sanctions on Côte d\'Ivoire (arms embargo)' },
      ],
    },
    2005: {
      headline: 'Darfur → ICC; Lebanon tribunal',
      body: "For the first time, the SC referred a situation (Darfur) to the ICC. Lebanon's Rafik Hariri was assassinated; the SC created the Special Tribunal for Lebanon. R2P was endorsed at the World Summit. The SC continued debating Iran's nuclear programme.",
      keyResolutions: [
        { symbol: 'S/RES/1593', label: 'Referred the Darfur situation to the ICC' },
        { symbol: 'S/RES/1595', label: 'Established the International Independent Investigation Commission (Hariri)' },
      ],
    },
    2006: {
      headline: 'North Korea nuclear test & Lebanon war',
      body: "North Korea conducted its first nuclear test (October); the SC unanimously passed Res. 1718 imposing sanctions and an arms embargo. The Israel-Hezbollah war ended with UNIFIL reinforced. The SC tightened Iran nuclear sanctions with Res. 1737.",
      keyResolutions: [
        { symbol: 'S/RES/1718', label: 'Sanctions and arms embargo on North Korea after nuclear test' },
        { symbol: 'S/RES/1701', label: 'UNIFIL ceasefire and reinforcement in Lebanon' },
      ],
    },
    2007: {
      headline: 'Darfur hybrid force, Myanmar vetoed',
      body: "After years of delay, UNAMID (a hybrid AU-UN force) was authorised for Darfur — the largest peacekeeping mission ever mandated. Russia and China vetoed a Western draft on Myanmar's Saffron Revolution crackdown. Chad/CAR border instability prompted MINURCAT.",
      keyResolutions: [
        { symbol: 'S/RES/1769', label: 'Established UNAMID hybrid force in Darfur' },
        { symbol: 'S/RES/1737', label: 'Tightened sanctions on Iran\'s nuclear programme' },
      ],
    },
    2008: {
      headline: 'Georgia war, Zimbabwe vetoed, piracy',
      body: "The Russia-Georgia war over South Ossetia paralysed the SC — Russia vetoed renewal of UNOMIG. A sanctions draft on Zimbabwe was vetoed by Russia and China. Somali piracy surged; the SC authorised unprecedented naval action in foreign waters under Res. 1816.",
      keyResolutions: [
        { symbol: 'S/RES/1816', label: 'Authorised naval action against Somali piracy' },
        { symbol: 'S/RES/1844', label: 'Targeted sanctions on spoilers of Somali peace' },
      ],
    },
    2009: {
      headline: 'Guinea, Sri Lanka and Iran deadlock',
      body: "Sri Lanka\'s civil war ended with massive civilian casualties; the SC was deeply divided and issued no resolution. The SC condemned the military coup in Guinea. North Korea's second nuclear test triggered tighter sanctions. The Iran nuclear standoff deepened.",
      keyResolutions: [
        { symbol: 'S/RES/1874', label: 'Tightened sanctions on North Korea after second nuclear test' },
        { symbol: 'S/RES/1907', label: 'Imposed sanctions on Eritrea for Somalia arms violations' },
      ],
    },
    2010: {
      headline: 'Haiti earthquake; Côte d\'Ivoire crisis',
      body: "The Haiti earthquake killed over 200,000; the SC doubled MINUSTAH's forces. Côte d\'Ivoire's disputed election result launched a political crisis that would escalate in 2011. The SC debated North Korea's sinking of ROKS Cheonan but issued only a presidential statement.",
      keyResolutions: [
        { symbol: 'S/RES/1908', label: 'Doubled MINUSTAH troops in Haiti after earthquake' },
        { symbol: 'S/RES/1929', label: 'Fourth round of sanctions on Iran (strongest yet)' },
      ],
    },
    2011: {
      headline: 'Libya R2P; first Syria veto',
      body: "The SC invoked R2P and authorised a no-fly zone over Libya (Res. 1973); NATO-led intervention ended with Gaddafi's death. South Sudan became the 193rd UN member. Russia and China cast the first of many vetoes on Syria as the civil war escalated.",
      keyResolutions: [
        { symbol: 'S/RES/1973', label: 'Authorised no-fly zone and force to protect civilians in Libya' },
        { symbol: 'S/RES/1996', label: 'Established UNMISS for newly independent South Sudan' },
      ],
    },
    2012: {
      headline: 'Syria veto deadlock; Mali crisis',
      body: "Russia and China vetoed three SC resolutions on Syria in 2012, enabling the Assad government to continue its campaign. The SC authorised AFISMA to address Mali's Tuareg-Islamist crisis. The SC also created UNSMIL for post-Gaddafi Libya.",
      keyResolutions: [
        { symbol: 'S/RES/2085', label: 'Authorised deployment of AFISMA to Mali' },
        { symbol: 'S/RES/2040', label: 'Extended and revised UNSMIL mandate in Libya' },
      ],
    },
    2013: {
      headline: 'Syria chemical weapons deal',
      body: "Syria's sarin attack on Eastern Ghouta nearly triggered US strikes. A US-Russia deal placed Syria's chemical weapons under OPCW oversight, enshrined in Res. 2118 — the most significant Syria SC consensus in two years. MINUSMA was established for Mali.",
      keyResolutions: [
        { symbol: 'S/RES/2118', label: 'Required Syria to eliminate chemical weapons programme' },
        { symbol: 'S/RES/2100', label: 'Established MINUSMA in Mali' },
      ],
    },
    2014: {
      headline: 'Ukraine, ISIS, and Ebola',
      body: "Russia vetoed a draft on Ukraine's territorial integrity and blocked the MH17 tribunal in 2015. The SC passed Res. 2178 on foreign terrorist fighters — the first binding measure on ISIS. Ebola in West Africa was declared a threat to international peace; an emergency UN mission (UNMEER) was created.",
      keyResolutions: [
        { symbol: 'S/RES/2178', label: 'Binding obligations on foreign terrorist fighters (ISIS)' },
        { symbol: 'S/RES/2177', label: 'Declared Ebola outbreak a threat to international peace' },
      ],
    },
    2015: {
      headline: 'JCPOA, Yemen, Bosnia and MH17 vetoed',
      body: "The SC endorsed the Iran nuclear deal (JCPOA) under Res. 2231. Yemen's intervention was implicitly acknowledged in Res. 2216. Russia vetoed a draft establishing an MH17 tribunal and another declaring Srebrenica a genocide. The Syria conflict entered its fourth year without SC consensus.",
      keyResolutions: [
        { symbol: 'S/RES/2231', label: 'Endorsed the JCPOA (Iran nuclear deal)' },
        { symbol: 'S/RES/2254', label: 'Endorsed Syria political transition process' },
      ],
    },
    2016: {
      headline: 'Aleppo siege and Colombia peace',
      body: "Russia vetoed multiple ceasefire drafts for Aleppo, enabling Assad forces to retake the city. The SC unanimously endorsed Colombia's peace deal with FARC. The Israeli settlements resolution (Res. 2334) passed with the US abstaining for the first time under Obama.",
      keyResolutions: [
        { symbol: 'S/RES/2334', label: 'Condemned Israeli settlement activity (US abstained)' },
        { symbol: 'S/RES/2307', label: 'Endorsed the Colombia-FARC peace agreement' },
      ],
    },
    2017: {
      headline: 'Syria chemical weapons; Jerusalem US veto',
      body: "Russia vetoed five SC resolutions on Syria in 2017 — four related to chemical weapons investigations after Khan Shaykhun. The US vetoed an Egyptian draft on Jerusalem following Trump's recognition of the city as Israel's capital. The DPRK sanctions regime was tightened twice.",
      keyResolutions: [
        { symbol: 'S/RES/2397', label: 'Tightest sanctions on North Korea following ICBM tests' },
        { symbol: 'S/RES/2375', label: 'Cut North Korea oil imports, banned textiles exports' },
      ],
    },
    2018: {
      headline: 'Syria vetoes: chemical weapons probes blocked',
      body: "Russia vetoed three SC resolutions aimed at investigating chemical weapons use in Syria, including the Douma attack. The US vetoed a draft condemning Israeli use of force in Gaza. The SC renewed pressure on Yemen and Sudan but reached no consensus on accountability.",
      keyResolutions: [
        { symbol: 'S/RES/2401', label: 'Demanded 30-day ceasefire in Syria (Russia later blocked implementation)' },
        { symbol: 'S/RES/2417', label: 'Condemned deliberate starvation of civilians as war crime' },
      ],
    },
    2019: {
      headline: 'Syria aid vetoed; Venezuela standoff',
      body: "Russia and China vetoed SC resolutions on Syria humanitarian aid twice in 2019, reducing cross-border access. Venezuela's political crisis produced a US-Russia confrontation in the Council, with both sides vetoing competing drafts. The DPRK sanctions panel was unable to renew under Russian objection.",
      keyResolutions: [
        { symbol: 'S/RES/2493', label: 'Extended WPS/Resolution 1325 (20th anniversary)' },
        { symbol: 'S/RES/2467', label: 'Addressed sexual violence in conflict (US/Russia objected to language)' },
      ],
    },
    2020: {
      headline: 'COVID deadlock; Syria vetoed twice',
      body: "US-China tensions over WHO language deadlocked the SC for months. Syria cross-border aid was vetoed twice by Russia and China, stripping aid routes to millions. Res. 2532 eventually demanded a 90-day humanitarian ceasefire globally. Lebanon's Beirut port explosion killed over 200; SC debates were inconclusive.",
      keyResolutions: [
        { symbol: 'S/RES/2532', label: 'Demanded 90-day humanitarian ceasefire during COVID pandemic' },
        { symbol: 'S/RES/2524', label: 'Authorised continued AMISOM mission in Somalia' },
      ],
    },
    2021: {
      headline: 'Myanmar divided Council; Afghanistan falls',
      body: "The February coup in Myanmar split the SC — Russia and China blocked strong action. Afghanistan\'s collapse in August prompted Res. 2593, demanding the Taliban not harbour terrorism. Haiti suffered a presidential assassination and earthquake within weeks; a security mission was debated.",
      keyResolutions: [
        { symbol: 'S/RES/2593', label: 'Demanded Afghanistan not be used as base for terrorism' },
        { symbol: 'S/RES/2585', label: 'Extended Syria humanitarian cross-border aid (one crossing only)' },
      ],
    },
    2022: {
      headline: 'Russia invades Ukraine — SC paralysed',
      body: "Russia's veto in the SC on 25 February 2022 — the day after invading Ukraine — triggered the fastest-ever emergency special session referral to the GA (Res. 2623). The SC held unprecedented public meetings on Ukraine but passed no resolutions on the conflict itself throughout the year.",
      keyResolutions: [
        { symbol: 'S/RES/2623', label: 'Referred Ukraine to GA emergency special session (procedural, no veto)' },
        { symbol: 'S/RES/2664', label: 'Created humanitarian exemption from UN sanctions regimes' },
      ],
    },
    2023: {
      headline: 'Gaza deadlock; Sudan; Mali withdrawal',
      body: "The US vetoed three SC ceasefire resolutions on Gaza after Hamas's 7 October attack. Russia vetoed renewal of MINUSMA (the Mali mission), forcing its withdrawal. Sudan's civil war between the SAF and RSF displaced millions; the SC struggled to respond.",
      keyResolutions: [
        { symbol: 'S/RES/2720', label: 'Established UN mechanism for Gaza humanitarian aid (first SC consensus)' },
        { symbol: 'S/RES/2706', label: 'Renewed UNOCI and West Africa missions' },
      ],
    },
    2024: {
      headline: 'Gaza vetoes; DPRK panel ended; Sudan',
      body: "The US cast four vetoes on Gaza, including blocking Palestine's full UN membership. Russia ended the DPRK sanctions monitoring panel. The SC passed Res. 2728 (first Ramadan ceasefire call, US abstained) and eventually Res. 2735. Sudan overtook Gaza in displaced persons with minimal SC response.",
      keyResolutions: [
        { symbol: 'S/RES/2728', label: 'Demanded immediate Ramadan ceasefire in Gaza (US abstained)' },
        { symbol: 'S/RES/2735', label: 'Supported Gaza ceasefire framework and hostage deal' },
      ],
    },
    2025: {
      headline: 'Gaza ceasefire; Ukraine anniversary; SC reform',
      body: "A Gaza ceasefire deal took effect in January, though implementation was fragile. Russia vetoed two Ukraine anniversary drafts at the same meeting. The US recalibrated its multilateral posture under the Trump administration, scrutinising UN budgets. SC reform and veto accountability debates intensified.",
      keyResolutions: [
        { symbol: 'S/RES/2749', label: 'Supported implementation of Gaza ceasefire deal' },
      ],
    },
  },

  // ─── General Assembly ──────────────────────────────────────────────────────
  GA: {
    1992: {
      headline: 'New members & the Rio Earth Summit',
      body: "The GA admitted 12 new states as the USSR dissolved and Yugoslavia broke apart, nearly doubling the membership of post-Cold War multilateralism. The Rio Earth Summit produced Agenda 21, the UNFCCC, and the Convention on Biological Diversity — anchoring environment on the GA agenda permanently.",
      keyResolutions: [
        { symbol: 'A/RES/47/121', label: 'Condemned ethnic cleansing in Yugoslavia' },
      ],
    },
    1993: {
      headline: 'Vienna Declaration & human rights architecture',
      body: "The Vienna World Conference on Human Rights produced the Vienna Declaration, reaffirming the universality of rights. The GA created the post of UN High Commissioner for Human Rights. The Oslo Accords raised hope for Israeli-Palestinian peace, debated extensively in the GA.",
      keyResolutions: [
        { symbol: 'A/RES/48/88', label: 'Demanded protection of civilians in Bosnia and Herzegovina' },
        { symbol: 'A/RES/48/58', label: 'Endorsed the Middle East peace process following Oslo Accords' },
      ],
    },
    1994: {
      headline: 'Cairo, UNCLOS enters force',
      body: "The International Conference on Population and Development in Cairo produced a 20-year programme of action on reproductive rights. UNCLOS entered into force, establishing the legal framework for the world's oceans. The GA debated the international response to the Rwandan genocide.",
      keyResolutions: [
        { symbol: 'A/RES/48/263', label: 'Resolved the deep seabed mining regime — enabling UNCLOS entry into force' },
        { symbol: 'A/RES/49/75F', label: 'Set the agenda for the 1995 NPT Review and Extension Conference' },
      ],
    },
    1995: {
      headline: 'Beijing Platform & NPT extension',
      body: "The Fourth World Conference on Women in Beijing produced the Platform for Action, the most comprehensive international framework on gender equality. States parties voted to extend the NPT indefinitely. The Copenhagen Social Summit set goals on poverty, employment, and social integration.",
      keyResolutions: [
        { symbol: 'A/RES/50/193', label: 'Condemned human rights violations in Bosnia (Srebrenica context)' },
        { symbol: 'A/RES/50/70P', label: 'Called for nuclear disarmament following NPT indefinite extension' },
      ],
    },
    1996: {
      headline: 'CTBT adopted; Boutros-Ghali blocked',
      body: "The GA adopted the text of the Comprehensive Nuclear-Test-Ban Treaty (CTBT). The treaty was opened for signature but the US, China, and India did not ratify. Kofi Annan was elected Secretary-General after the US vetoed Boutros-Ghali's reappointment in the SC.",
      keyResolutions: [
        { symbol: 'A/RES/50/245', label: 'Adopted the CTBT text and opened it for signature' },
        { symbol: 'A/RES/51/45A', label: 'Urged progress on nuclear disarmament obligations' },
      ],
    },
    1997: {
      headline: 'Kofi Annan\'s reform agenda & Kyoto',
      body: "Kofi Annan launched \"Renewing the United Nations\" — the first major reform package restructuring the Secretariat and creating the Deputy SG post. The Kyoto Protocol was adopted under UNFCCC (not GA). The Ottawa Treaty banning anti-personnel landmines was opened for signature.",
      keyResolutions: [
        { symbol: 'A/RES/52/33', label: 'Debated role of science and technology in post-Cold War security (103-43)' },
        { symbol: 'A/RES/52/38A', label: 'Endorsed the Ottawa Convention banning anti-personnel landmines' },
      ],
    },
    1998: {
      headline: 'ICC Rome Statute & nuclear pressure',
      body: "The Rome Statute establishing the International Criminal Court was adopted at a GA-convened conference (120 in favour, 7 against including the US, China, and Israel). India and Pakistan conducted nuclear tests; the GA condemned both through a joint resolution.",
      keyResolutions: [
        { symbol: 'A/RES/53/77G', label: 'Condemned nuclear testing and called for a global moratorium' },
        { symbol: 'A/RES/52/38A', label: 'Reaffirmed urgency of nuclear disarmament' },
      ],
    },
    1999: {
      headline: 'Millennium Road & Kosovo debate',
      body: "Preparatory work for the Millennium Summit dominated the 54th session. The GA debated the legitimacy of NATO's Kosovo intervention, which bypassed the SC — no resolution was passed on Kosovo itself. Timor-Leste's transition was endorsed. The GA adopted the Declaration on the Right to Development.",
      keyResolutions: [
        { symbol: 'A/RES/54/183', label: 'Called for human rights protection in Kosovo' },
        { symbol: 'A/RES/54/63', label: 'Called for universalisation of the Comprehensive Nuclear-Test-Ban Treaty' },
      ],
    },
    2000: {
      headline: 'Millennium Declaration and MDGs',
      body: "The largest-ever gathering of heads of state adopted the Millennium Declaration, committing to eight Millennium Development Goals to be achieved by 2015. The Brahimi Report on peacekeeping reform was submitted to the GA. Israel withdrew from Lebanon after 22 years.",
      keyResolutions: [
        { symbol: 'A/RES/54/267', label: 'Financed UNIFIL as Israel completed its withdrawal from Lebanon' },
        { symbol: 'A/RES/55/138', label: 'Requested comprehensive review of peacekeeping (Brahimi Report follow-up)' },
      ],
    },
    2001: {
      headline: '9/11 emergency session & Durban',
      body: "A GA emergency special session on terrorism was convened after 9/11. The Durban World Conference against Racism was overshadowed by walkouts over language on Israel and reparations. GA debates on globalisation and development foreshadowed the Doha Round launched at the WTO.",
      keyResolutions: [
        { symbol: 'A/RES/56/20', label: 'Debated science, technology and security in the post-9/11 context (92-46)' },
        { symbol: 'A/RES/56/24[C]', label: 'Called for reducing nuclear danger' },
      ],
    },
    2002: {
      headline: 'Monterrey Consensus & ICC in force',
      body: "The Monterrey Consensus linked development finance to governance reform and increased ODA commitments from donors. The ICC entered into force on 1 July. The Johannesburg World Summit on Sustainable Development reviewed Rio commitments. GA debated Iraq inspections.",
      keyResolutions: [
        { symbol: 'A/RES/57/85', label: 'Followed up ICJ advisory opinion on the legality of nuclear weapons' },
        { symbol: 'A/RES/57/223', label: 'Affirmed the right to development as a universal human right' },
      ],
    },
    2003: {
      headline: 'Iraq war — GA divided',
      body: "The Iraq invasion without SC authorisation triggered intense GA debate. France and Germany led a bloc opposing the war; the GA passed no resolution condemning it but debated the UN Charter's scope. The WTO Cancún talks collapsed. The GA began discussions on UN system reform.",
      keyResolutions: [
        { symbol: 'A/RES/58/171', label: 'Condemned human rights violations linked to unilateral coercive measures (125-53)' },
        { symbol: 'A/RES/58/189', label: 'Endorsed the principle of non-interference in internal affairs' },
      ],
    },
    2004: {
      headline: 'ICJ wall opinion; Oil-for-Food',
      body: "The ICJ delivered its advisory opinion that Israel's West Bank separation barrier violated international law; the GA passed a resolution demanding its removal (150-6). The Oil-for-Food scandal implicated senior UN officials. The GA debated tsunami humanitarian response.",
      keyResolutions: [
        { symbol: 'A/RES/ES-10/15', label: 'Demanded dismantlement of the Israeli separation barrier (ICJ ruling)' },
      ],
    },
    2005: {
      headline: 'World Summit — R2P, HRC, SDGs seeded',
      body: "The 2005 World Summit Outcome Document was the most significant GA resolution since the Charter: it endorsed R2P, replaced the Human Rights Commission with the Human Rights Council, and created the Peacebuilding Commission. The MDG+5 review found progress uneven.",
      keyResolutions: [
        { symbol: 'A/RES/60/251', label: 'Established the Human Rights Council (March 2006)' },
      ],
    },
    2006: {
      headline: 'Human Rights Council & Ban Ki-moon',
      body: "The Human Rights Council held its inaugural session, replacing the widely discredited Commission. Ban Ki-moon was elected Secretary-General. North Korea's nuclear test dominated disarmament debates. The GA debated Lebanon and the UNIFIL reinforcement.",
      keyResolutions: [
        { symbol: 'A/RES/61/295', label: 'United Nations Declaration on the Rights of Indigenous Peoples (adopted 2007)' },
        { symbol: 'A/RES/61/89', label: 'Initiated process toward an Arms Trade Treaty' },
      ],
    },
    2007: {
      headline: 'Climate on the GA agenda',
      body: "The GA held its first formal debate on climate change as a security issue. The IPCC's Fourth Assessment Report and Al Gore shared the Nobel Peace Prize. The Bali Action Plan launched negotiations for a post-Kyoto framework. The Declaration on Indigenous Peoples\' Rights was finally adopted.",
      keyResolutions: [
        { symbol: 'A/RES/61/295', label: 'Adopted the Declaration on the Rights of Indigenous Peoples' },
        { symbol: 'A/RES/62/36', label: 'Called for UN conference on the world financial crisis' },
      ],
    },
    2008: {
      headline: 'Financial crisis emergency session',
      body: "The Lehman Brothers collapse triggered the worst global recession since the 1930s; the GA convened a special session on the crisis and proposed reforming the international financial architecture. Human rights resolutions on Gaza generated significant North-South divisions.",
      keyResolutions: [
        { symbol: 'A/RES/63/179', label: 'Condemned human rights violations caused by unilateral economic coercion (132-54)' },
        { symbol: 'A/RES/63/189', label: 'Promoted a democratic and equitable international economic order (124-55)' },
      ],
    },
    2009: {
      headline: 'Copenhagen failure & Goldstone Report',
      body: "The Copenhagen climate summit failed to produce a binding treaty; the GA debated ambition and equity. The Goldstone Report on Gaza was presented through the Human Rights Council and then GA. The GA held a special session on the financial crisis and reform of the international monetary system.",
      keyResolutions: [
        { symbol: 'A/RES/64/292', label: 'Recognised the human right to safe drinking water and sanitation' },
        { symbol: 'A/RES/64/10', label: 'Followed up on the Goldstone Report into the 2009 Gaza conflict (114-18)' },
      ],
    },
    2010: {
      headline: 'MDG Summit & right to water',
      body: "The MDG Review Summit took stock of a decade of progress — mixed, with sub-Saharan Africa and LDCs lagging. The GA recognised the right to water and sanitation as a human right. WikiLeaks released diplomatic cables. The GA debated Haiti earthquake response.",
      keyResolutions: [
        { symbol: 'A/RES/64/254', label: 'Second follow-up to the Goldstone Report on Gaza (98-7)' },
        { symbol: 'A/RES/64/292', label: 'Declared safe drinking water a fundamental human right' },
      ],
    },
    2011: {
      headline: 'Arab Spring; Palestine membership rejected',
      body: "The Arab Spring brought debates on popular sovereignty and human rights to the GA floor. Palestine applied for full UN membership; the SC failed to recommend it. The GA passed resolutions on Syria, Libya, and the Arab world with growing North-South tension. South Sudan was admitted as the 193rd member.",
      keyResolutions: [
        { symbol: 'A/RES/66/253A', label: 'Condemned Syrian human rights violations, demanded cessation of violence (137-12)' },
        { symbol: 'A/RES/66/11', label: 'Restored Libya\'s rights in the Human Rights Council post-Gaddafi (123-4)' },
      ],
    },
    2012: {
      headline: 'Palestine upgraded; Rio+20',
      body: "The GA voted 138-9 to grant Palestine non-member observer state status — the highest diplomatic recognition the GA could confer. Rio+20 produced 'The Future We Want' sustainability framework. GA debates on Syria intensified as the SC remained deadlocked.",
      keyResolutions: [
        { symbol: 'A/RES/67/19', label: 'Granted Palestine non-member observer state status (138-9-41)' },
        { symbol: 'A/RES/66/253B', label: 'Condemned ongoing Syrian government violence (133-12)' },
      ],
    },
    2013: {
      headline: 'Arms Trade Treaty & post-2015 process',
      body: "The Arms Trade Treaty was adopted by the GA (154-3). The Open Working Group on SDGs was established to design the post-2015 development agenda. GA resolutions on Syria condemned the government but produced no enforcement mechanism given SC deadlock.",
      keyResolutions: [
        { symbol: 'A/RES/67/234B', label: 'Adopted the Arms Trade Treaty (154-3)' },
        { symbol: 'A/RES/68/31', label: 'Endorsed the Arms Trade Treaty opening for signature' },
      ],
    },
    2014: {
      headline: 'Ukraine integrity affirmed; SDG framework set',
      body: "The GA voted 100-11 to affirm Ukraine's territorial integrity and declare the Crimea referendum invalid after Russia's annexation — a landmark non-binding but politically significant resolution. The Open Working Group published 17 SDG goals and 169 targets for GA adoption in 2015.",
      keyResolutions: [
        { symbol: 'A/RES/68/262', label: 'Affirmed Ukraine\'s territorial integrity; Crimea referendum invalid (100-11-58)' },
        { symbol: 'A/RES/69/173', label: 'Addressed globalization\'s impact on human rights in the lead-up to 2015 SDG summit (135-53)' },
      ],
    },
    2015: {
      headline: '2030 Agenda, Paris Agreement, JCPOA',
      body: "The most ambitious year in GA history: the 2030 Agenda with 17 SDGs was adopted unanimously in September. Addis Ababa secured development finance commitments. The Paris Agreement was concluded at COP21. The Syrian refugee crisis generated emergency GA resolutions.",
      keyResolutions: [
        { symbol: 'A/RES/69/319', label: 'Adopted Basic Principles on Sovereign Debt Restructuring (136-6)' },
        { symbol: 'A/RES/70/83', label: 'Affirmed assistance to Palestine refugees (167-1)' },
      ],
    },
    2016: {
      headline: 'New York Declaration on refugees & migration',
      body: "The GA adopted the New York Declaration for Refugees and Migrants unanimously — the largest global commitment to refugee and migrant protection. The GA condemned Israeli settlements and demanded a freeze. Guterres was elected Secretary-General. The Paris Agreement entered into force.",
      keyResolutions: [
        { symbol: 'A/RES/71/24', label: 'Called for Israeli withdrawal from the occupied Syrian Golan (103-6)' },
        { symbol: 'A/RES/71/23', label: 'Condemned Israeli settlement activity (153-7)' },
      ],
    },
    2017: {
      headline: 'Jerusalem null and void; nuclear ban treaty',
      body: "The GA voted 128-9 to declare Trump's Jerusalem recognition null and void. The Treaty on the Prohibition of Nuclear Weapons (TPNW) was adopted by the GA (122-1-1) — rejected by nuclear-armed states. The Rohingya crisis generated multiple GA resolutions on Myanmar.",
      keyResolutions: [
        { symbol: 'A/RES/ES-10/19', label: 'Declared US Jerusalem recognition null and void (128-9-35)' },
        { symbol: 'A/RES/72/30', label: 'Affirmed humanitarian consequences as basis for nuclear weapons prohibition (141-15)' },
      ],
    },
    2018: {
      headline: 'Gaza resolutions; Global Compact on Migration',
      body: "The GA passed resolutions calling for an international inquiry into Israeli use of force against Gaza protesters. The Global Compact for Safe, Orderly and Regular Migration was adopted. The US formally withdrew from the Human Rights Council, signalling broader disengagement.",
      keyResolutions: [
        { symbol: 'A/RES/ES-10/20', label: 'Called for protection of Palestinians and independent inquiry' },
        { symbol: 'A/RES/73/195', label: 'Endorsed the Global Compact for Safe Migration' },
      ],
    },
    2019: {
      headline: 'Climate emergency & TPNW progress',
      body: "Greta Thunberg's address at the GA Climate Action Summit galvanised youth climate activism. The GA held a High-Level Political Forum on SDG implementation, with most goals off-track. The TPNW inched toward the 50 ratifications needed for entry into force.",
      keyResolutions: [
        { symbol: 'A/RES/74/29', label: 'Addressed developments in ICT and international security (129-6)' },
        { symbol: 'A/RES/74/67', label: 'Renewed call for universal adherence to the NPT and disarmament' },
      ],
    },
    2020: {
      headline: 'COVID pandemic; vaccine equity',
      body: "The GA held its first-ever high-level meeting on COVID-19, adopting a declaration on equitable vaccine access. The 75th anniversary of the UN produced a landmark declaration on multilateralism. The Black Lives Matter movement prompted GA debates on systemic racism and police violence.",
      keyResolutions: [
        { symbol: 'A/RES/74/306', label: 'Called for comprehensive international response to COVID-19 (169-2)' },
        { symbol: 'A/RES/75/47', label: 'Promoted multilateralism in disarmament and non-proliferation (130-4)' },
      ],
    },
    2021: {
      headline: 'COP26, food systems & Taliban credentials',
      body: "The GA Food Systems Summit launched ambitions to transform global food systems. COP26 in Glasgow produced the Glasgow Climate Pact. The Taliban's representative claimed Afghanistan's GA seat; the Credentials Committee deferred a decision. Vaccine inequity between the Global North and South was widely debated.",
      keyResolutions: [
        { symbol: 'A/RES/76/300', label: 'Recognised that access to a clean environment is a human right' },
        { symbol: 'A/RES/76/179', label: 'Called for equitable global vaccine distribution' },
      ],
    },
    2022: {
      headline: 'Ukraine — GA condemns invasion (141-5)',
      body: "The emergency special session on Ukraine produced GA resolution ES-11/1 (141-5-35) condemning Russia's invasion — the most significant GA vote on a great-power conflict since 1950. The human right to a clean, healthy environment was formally recognised. The GA created a TPNW first meeting of states parties.",
      keyResolutions: [
        { symbol: 'A/RES/ES-11/1', label: 'Condemned Russia\'s invasion of Ukraine (141-5-35)' },
        { symbol: 'A/RES/ES-11/4', label: 'Suspended Russia from the Human Rights Council (93-24-58)' },
      ],
    },
    2023: {
      headline: 'Gaza emergency sessions; AI governance',
      body: "The GA held multiple emergency special sessions on Gaza after Hamas's 7 October attack; resolution ES-10/21 demanded an immediate humanitarian ceasefire (121-14-44). The UN held its first high-level dialogue on AI governance. The SDG midpoint review found the world behind on nearly every goal.",
      keyResolutions: [
        { symbol: 'A/RES/ES-10/21', label: 'Demanded immediate humanitarian ceasefire in Gaza (121-14-44)' },
        { symbol: 'A/RES/ES-11/6', label: 'Affirmed UN Charter principles underlying a comprehensive peace in Ukraine (141-7)' },
      ],
    },
    2024: {
      headline: 'Pact for the Future; ICJ ruling; Palestine vote',
      body: "The Summit of the Future adopted the 'Pact for the Future' including an AI governance compact and SDG acceleration commitments. South Africa's ICJ case on Gaza influenced GA resolutions on accountability. The GA voted to support Palestine's rights pending full membership consideration.",
      keyResolutions: [
        { symbol: 'A/RES/ES-10/23', label: 'Voted on Palestine\'s admission and rights in the United Nations' },
        { symbol: 'A/RES/78/316', label: 'Addressed safety of Ukrainian nuclear facilities including Zaporizhzhia (99-9)' },
      ],
    },
    2025: {
      headline: 'US unilateralism and multilateral stress',
      body: "The Trump administration's return brought US withdrawal from the WHO, Paris Agreement, and scrutiny of UN funding — testing GA cohesion. GA debates on SC reform and veto accountability intensified, with the 'Uniting for Peace' mechanism explored. Global South coalitions asserted greater agenda influence.",
      keyResolutions: [
        { symbol: 'A/RES/ES-11/7', label: 'Advancing a comprehensive, just and lasting peace in Ukraine' },
        { symbol: 'A/RES/80/40', label: 'Promotion of multilateralism in the area of disarmament and non-proliferation' },
      ],
    },
  },
};
