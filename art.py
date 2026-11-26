"""Inline SVG artwork used by build.py: sprite symbols, illustrated map, footer skyline."""

SPRITE = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<symbol id="d-apple" viewBox="0 0 100 100"><path d="M50 28c-10-8-32-6-36 18-3 24 14 44 28 42 5-1 6-3 8-3s3 2 8 3c14 2 31-18 28-42-4-24-26-26-36-18z" fill="#c8302b"/><path d="M30 44c2-8 8-12 14-12" stroke="#ff9b87" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/><path d="M50 28c0-8 3-15 9-20" stroke="#4a3320" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M56 14c8-8 20-6 24 0-8 6-18 6-24 0z" fill="#5f8a3a"/></symbol>
<symbol id="d-fish" viewBox="0 0 140 80"><path d="M8 40C30 8 82 4 112 36l24-22v52l-24-22C82 76 30 72 8 40z" fill="#5f9aa6"/><path d="M20 38C48 30 90 30 118 38" stroke="#e9785a" stroke-width="7" stroke-linecap="round" fill="none"/><g fill="#2b4b4e"><circle cx="50" cy="26" r="2.2"/><circle cx="66" cy="22" r="2.2"/><circle cx="82" cy="24" r="2.2"/></g><circle cx="28" cy="34" r="4.5" fill="#fff"/><circle cx="27" cy="34" r="2.4" fill="#1d2a1f"/><path d="M62 22c6-10 16-12 24-8-4 6-12 10-24 8z" fill="#3f7a86"/></symbol>
<symbol id="d-sheep" viewBox="0 0 120 100"><g fill="#f4ecdb" stroke="#c9bd9f" stroke-width="2"><circle cx="40" cy="42" r="20"/><circle cx="62" cy="34" r="22"/><circle cx="84" cy="44" r="20"/><circle cx="52" cy="58" r="20"/><circle cx="76" cy="60" r="20"/><circle cx="34" cy="60" r="14"/></g><circle cx="60" cy="48" r="26" fill="#fbf6ea"/><rect x="40" y="76" width="7" height="20" rx="3" fill="#3a3027"/><rect x="74" y="76" width="7" height="20" rx="3" fill="#3a3027"/><ellipse cx="22" cy="48" rx="13" ry="16" fill="#3a3027"/><circle cx="19" cy="45" r="2" fill="#f4ecdb"/></symbol>
<symbol id="d-wheat" viewBox="0 0 80 120"><path d="M40 118V30" stroke="#b78a2a" stroke-width="4" stroke-linecap="round"/><g fill="#e3b04b" stroke="#b78a2a" stroke-width="1.5"><ellipse cx="40" cy="16" rx="6" ry="12"/><ellipse cx="29" cy="32" rx="6" ry="12" transform="rotate(-30 29 32)"/><ellipse cx="51" cy="32" rx="6" ry="12" transform="rotate(30 51 32)"/><ellipse cx="28" cy="52" rx="6" ry="12" transform="rotate(-30 28 52)"/><ellipse cx="52" cy="52" rx="6" ry="12" transform="rotate(30 52 52)"/><ellipse cx="29" cy="72" rx="6" ry="12" transform="rotate(-30 29 72)"/><ellipse cx="51" cy="72" rx="6" ry="12" transform="rotate(30 51 72)"/></g></symbol>
<symbol id="d-cherry" viewBox="0 0 100 100"><path d="M32 66C34 40 46 22 70 10M72 70C70 44 70 26 70 10" stroke="#4d6b2d" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="30" cy="72" r="20" fill="#9d1b2f"/><circle cx="72" cy="74" r="20" fill="#b3223a"/><circle cx="23" cy="65" r="5" fill="#fff" opacity=".35"/><circle cx="65" cy="67" r="5" fill="#fff" opacity=".35"/><path d="M70 10c10-6 22-2 24 6-10 4-20 2-24-6z" fill="#5f8a3a"/></symbol>
<symbol id="d-walnut" viewBox="0 0 100 100"><path d="M50 8C24 8 10 28 12 54c2 26 18 40 38 40s36-14 38-40C90 28 76 8 50 8z" fill="#b48a5b"/><path d="M50 8v86" stroke="#7a5832" stroke-width="3"/><g stroke="#7a5832" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M30 30c8 6 8 14 0 20M70 30c-8 6-8 14 0 20M32 62c8 4 10 12 4 20M68 62c-8 4-10 12-4 20"/></g></symbol>
<symbol id="d-tree" viewBox="0 0 100 120"><rect x="44" y="68" width="12" height="48" rx="4" fill="#6b4a2e"/><circle cx="50" cy="42" r="30" fill="#3f7d3e"/><circle cx="27" cy="58" r="21" fill="#4a8c45"/><circle cx="73" cy="58" r="21" fill="#46873f"/><circle cx="50" cy="24" r="20" fill="#57994c"/><g fill="#d8352f"><circle cx="38" cy="40" r="4.5"/><circle cx="62" cy="34" r="4.5"/><circle cx="26" cy="62" r="4.5"/><circle cx="72" cy="60" r="4.5"/><circle cx="52" cy="56" r="4.5"/><circle cx="50" cy="20" r="4"/></g></symbol>
<symbol id="d-branch" viewBox="0 0 160 100"><path d="M4 86Q60 76 100 46T156 12" stroke="#7a5a36" stroke-width="4" fill="none" stroke-linecap="round"/><g fill="#5f8a3a"><ellipse cx="36" cy="66" rx="16" ry="7" transform="rotate(-30 36 66)"/><ellipse cx="62" cy="80" rx="16" ry="7" transform="rotate(20 62 80)"/><ellipse cx="92" cy="40" rx="16" ry="7" transform="rotate(-45 92 40)"/><ellipse cx="128" cy="22" rx="14" ry="6" transform="rotate(-25 128 22)"/><ellipse cx="112" cy="58" rx="15" ry="6" transform="rotate(25 112 58)"/></g><circle cx="76" cy="66" r="13" fill="#c8302b"/><circle cx="132" cy="40" r="11" fill="#d8352f"/><circle cx="71" cy="61" r="3.5" fill="#fff" opacity=".4"/></symbol>
<symbol id="sk-tree" viewBox="0 0 40 60"><rect x="18" y="38" width="4" height="22"/><circle cx="20" cy="22" r="16"/><circle cx="10" cy="30" r="10"/><circle cx="30" cy="30" r="10"/></symbol>
<symbol id="sk-pine" viewBox="0 0 40 70"><path d="M20 0l14 22H26l12 20H27l11 18H2l11-18H2l12-20H6z"/><rect x="18" y="58" width="4" height="12"/></symbol>
<symbol id="sk-sheep" viewBox="0 0 60 40"><ellipse cx="30" cy="20" rx="20" ry="13"/><circle cx="16" cy="14" r="8"/><circle cx="44" cy="14" r="8"/><ellipse cx="9" cy="22" rx="7" ry="8"/><rect x="18" y="28" width="4" height="12"/><rect x="38" y="28" width="4" height="12"/></symbol>
<symbol id="sk-apple" viewBox="0 0 40 44"><path d="M20 10C14 4 4 7 4 20c0 12 8 22 14 20 1-.3 1.500-1 2-1s1 .7 2 1c6 2 14-8 14-20C36 7 26 4 20 10z"/><rect x="19" y="0" width="3" height="10" rx="1.500"/></symbol>
</defs></svg>'''

SKYLINE = '''<div class="skyline" aria-hidden="true"><svg viewBox="0 0 1440 110" preserveAspectRatio="xMidYMax slice">
<path d="M0 110V70C120 40 240 40 360 62S600 90 760 62 1040 24 1200 50 1380 70 1440 56V110Z" fill="currentColor"/>
<g fill="currentColor">
<use href="#sk-pine" x="60" y="22" width="34" height="62"/><use href="#sk-tree" x="120" y="24" width="38" height="56"/><use href="#sk-tree" x="168" y="30" width="30" height="44"/>
<use href="#sk-sheep" x="262" y="42" width="52" height="35"/><use href="#sk-sheep" x="322" y="48" width="40" height="27"/>
<use href="#sk-tree" x="430" y="38" width="36" height="52"/><use href="#sk-tree" x="476" y="44" width="30" height="44"/><use href="#sk-apple" x="520" y="52" width="26" height="29"/>
<use href="#sk-pine" x="640" y="28" width="30" height="55"/><use href="#sk-pine" x="676" y="36" width="24" height="44"/>
<use href="#sk-tree" x="820" y="30" width="40" height="58"/><use href="#sk-tree" x="870" y="26" width="42" height="62"/><use href="#sk-tree" x="920" y="32" width="36" height="52"/>
<use href="#sk-sheep" x="1010" y="14" width="50" height="34"/>
<use href="#sk-tree" x="1110" y="22" width="40" height="58"/><use href="#sk-tree" x="1158" y="28" width="34" height="50"/><use href="#sk-pine" x="1230" y="16" width="34" height="62"/><use href="#sk-tree" x="1290" y="26" width="38" height="56"/><use href="#sk-apple" x="1352" y="34" width="28" height="31"/>
</g></svg></div>'''

MAP_SVG = '''<svg class="wmap" viewBox="0 0 900 640" role="img" aria-labelledby="mapT mapD">
<title id="mapT">Illustrated map of Welkin Farmstead near Sopore, Kashmir</title>
<desc id="mapD">A hand-drawn map showing Sopore on the Jhelum river near Wular Lake, with Welkin Farmstead in the orchards and Welkin Aquaculture beside the river. Not to scale.</desc>
<defs>
<pattern id="m-orch" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="5.500" fill="#4f8a3a"/><circle cx="20" cy="20" r="5.500" fill="#5a9a42"/><circle cx="5" cy="6" r="1.500" fill="#c4382c"/><circle cx="19" cy="19" r="1.500" fill="#c4382c"/><circle cx="9" cy="9" r="1.300" fill="#c4382c"/></pattern>
<linearGradient id="m-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3eef0"/><stop offset="1" stop-color="#f3eedb"/></linearGradient>
<clipPath id="m-clip"><rect width="900" height="640" rx="26"/></clipPath>
<path id="m-pA" d="M290 215Q360 178 450 205Q505 235 482 288Q420 314 350 298Q285 276 290 215Z"/>
<path id="m-pB" d="M470 396Q540 384 604 410Q626 452 562 474Q490 468 464 432Z"/>
<path id="m-pC" d="M118 330Q190 298 252 330Q272 372 200 388Q140 382 118 330Z"/>
<path id="m-river" d="M650 255C590 265 540 300 480 322C410 348 330 345 250 385S90 440 -10 462"/>
</defs>
<g clip-path="url(#m-clip)">
<rect width="900" height="640" fill="url(#m-sky)"/>
<path d="M0 150C150 190 300 168 450 198S780 186 900 230V640H0Z" fill="#e1ebc9"/>
<path d="M0 420C200 400 380 450 560 430S800 470 900 450V640H0Z" fill="#d6e4bc"/>
<path d="M0 140L70 70 120 105 210 25 290 100 370 50 450 115 540 35 640 105 730 45 810 100 900 60V0H0Z" fill="#c4d3d6"/>
<path d="M0 120L90 80 160 112 250 62 330 118 420 78 520 125 610 70 700 120 790 80 900 118V0H0Z" fill="#a8bfb8"/>
<g fill="#fff" opacity=".95"><path d="M210 25l-22 30 12-6 10 8 10-8 12 6z"/><path d="M540 35l-22 30 12-6 10 8 10-8 12 6z"/><path d="M730 45l-20 28 11-5 9 7 9-7 11 5z"/><path d="M370 50l-18 26 10-5 8 6 8-6 10 5z"/><path d="M70 70l-16 22 9-4 7 5 7-5 9 4z"/></g>
<path d="M0 210l0 0" fill="none"/>
<path d="M640 215C660 170 740 150 800 175C860 200 872 262 822 292C770 322 690 312 650 276C632 256 630 236 640 215Z" fill="#6aa8bd"/>
<path d="M660 232C690 205 760 196 806 214" stroke="#a6d3df" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M672 262C710 246 770 244 808 262" stroke="#a6d3df" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
<use href="#m-pA" fill="#a9cf86"/><use href="#m-pA" fill="url(#m-orch)"/>
<use href="#m-pB" fill="#a9cf86"/><use href="#m-pB" fill="url(#m-orch)"/>
<use href="#m-pC" fill="#a9cf86"/><use href="#m-pC" fill="url(#m-orch)"/>
<path d="M850 640C812 540 800 450 776 352C770 332 752 318 728 306" stroke="#6aa8bd" stroke-width="18" fill="none" stroke-linecap="round"/>
<path d="M850 640C812 540 800 450 776 352C770 332 752 318 728 306" stroke="#a6d3df" stroke-width="7" fill="none" stroke-linecap="round"/>
<use href="#m-river" stroke="#6aa8bd" stroke-width="18" fill="none" stroke-linecap="round"/>
<use href="#m-river" stroke="#a6d3df" stroke-width="7" fill="none" stroke-linecap="round"/>
<use href="#m-river" class="flow" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M870 612C770 548 700 440 600 394C540 366 500 354 470 348C380 332 250 374 140 412S20 432-10 438" stroke="#d9c9a0" stroke-width="13" fill="none" stroke-linecap="round"/>
<path d="M870 612C770 548 700 440 600 394C540 366 500 354 470 348C380 332 250 374 140 412S20 432-10 438" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>
<path d="M870 612C770 548 700 440 600 394C540 366 500 354 470 348C380 332 250 374 140 412S20 432-10 438" stroke="#c4b78e" stroke-width="1.800" stroke-dasharray="8 9" fill="none"/>
<g fill="#3f7a45"><use href="#sk-pine" x="40" y="150" width="26" height="46"/><use href="#sk-pine" x="70" y="162" width="22" height="40"/><use href="#sk-pine" x="560" y="150" width="24" height="42"/><use href="#sk-pine" x="590" y="158" width="20" height="36"/><use href="#sk-pine" x="120" y="480" width="26" height="46"/><use href="#sk-pine" x="150" y="494" width="22" height="40"/><use href="#sk-pine" x="700" y="500" width="26" height="46"/><use href="#sk-pine" x="730" y="512" width="22" height="40"/><use href="#sk-pine" x="300" y="520" width="24" height="42"/></g>
<g fill="#5a9a42"><use href="#sk-tree" x="200" y="440" width="30" height="45"/><use href="#sk-tree" x="640" y="470" width="30" height="45"/><use href="#sk-tree" x="380" y="480" width="30" height="45"/></g>
<g transform="translate(412 298)"><rect x="0" y="6" width="14" height="11" fill="#e0a070"/><path d="M-2 7l9-9 9 9z" fill="#b4573a"/><rect x="18" y="10" width="12" height="9" fill="#e8b384"/><path d="M16 11l8-8 8 8z" fill="#9c4a31"/><rect x="-14" y="12" width="11" height="8" fill="#e8b384"/><path d="M-16 13l8-8 8 8z" fill="#b4573a"/></g>
<use href="#d-sheep" x="300" y="302" width="40" height="33"/><use href="#d-sheep" x="338" y="312" width="30" height="25"/><use href="#d-sheep" x="258" y="222" width="30" height="25"/>
<g><use href="#d-fish" x="-19" y="-11" width="38" height="22"/><animateMotion dur="16s" repeatCount="indefinite" rotate="auto-reverse"><mpath href="#m-river"/></animateMotion></g>
<g><use href="#d-fish" x="-15" y="-9" width="30" height="17"/><animateMotion dur="22s" begin="-9s" repeatCount="indefinite" rotate="auto-reverse"><mpath href="#m-river"/></animateMotion></g>
<g class="cloud" fill="#fff" opacity=".85"><ellipse cx="170" cy="40" rx="42" ry="13"/><ellipse cx="195" cy="30" rx="26" ry="12"/><ellipse cx="148" cy="34" rx="22" ry="10"/></g>
<g class="cloud c2" fill="#fff" opacity=".8"><ellipse cx="600" cy="26" rx="36" ry="11"/><ellipse cx="620" cy="18" rx="22" ry="10"/></g>
<circle cx="110" cy="440" r="9" fill="#fff" stroke="#17261c" stroke-width="3"/>
<circle cx="835" cy="590" r="9" fill="#fff" stroke="#17261c" stroke-width="3"/>
<circle cx="440" cy="318" r="9" fill="#17261c"/>
<g class="lbl"><text x="110" y="476" text-anchor="middle">Baramulla</text><text x="810" y="624" text-anchor="end">Srinagar</text><text x="426" y="302" text-anchor="end" class="big">Sopore</text><text x="745" y="238" text-anchor="middle" class="it">Wular Lake</text><text x="240" y="418" class="it sm" transform="rotate(-11 240 418)">Jhelum river</text></g>
<g class="pin"><circle class="pulse" cx="372" cy="218" r="18" fill="#c4382c"/><g transform="translate(372 268)"><path d="M0 0c-16-24-26-34-26-50a26 26 0 1 1 52 0c0 16-10 26-26 50z" fill="#c4382c" stroke="#fff" stroke-width="4"/><circle cy="-50" r="14" fill="#fff"/><use href="#d-apple" x="-10" y="-60" width="20" height="20"/></g></g>
<g class="pin aq"><circle class="pulse p2" cx="500" cy="322" r="18" fill="#1d5c66"/><g transform="translate(500 372)"><path d="M0 0c-16-24-26-34-26-50a26 26 0 1 1 52 0c0 16-10 26-26 50z" fill="#1d5c66" stroke="#fff" stroke-width="4"/><circle cy="-50" r="14" fill="#fff"/><use href="#d-fish" x="-11" y="-57" width="22" height="13"/></g></g>
<g class="lbl"><text x="340" y="196" text-anchor="end" class="big brand">Welkin Farmstead</text><text x="524" y="430" class="big aqua">Welkin Aquaculture</text></g>
<g transform="translate(70 570)"><circle r="34" fill="#fff" stroke="#17261c" stroke-width="2" opacity=".9"/><path d="M0-28L7 0 0 28-7 0z" fill="#c4382c"/><path d="M-28 0L0-7 28 0 0 7z" fill="#17261c" opacity=".35"/><text y="-38" text-anchor="middle" class="n">N</text></g>
<text x="450" y="624" text-anchor="middle" class="note">Illustrated map · not to scale</text>
</g>
<rect x="1" y="1" width="898" height="638" rx="26" fill="none" stroke="#17261c" stroke-opacity=".15" stroke-width="2"/>
</svg>'''
