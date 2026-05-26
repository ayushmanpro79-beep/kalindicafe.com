const ADMIN_PASSWORD = "moonlight-archive-1937";
const STORAGE_KEY = "cryptopedia-db-v2";
const ADMIN_KEY = "cryptopedia-admin-unlocked";
const LEGACY_STORAGE_KEYS = ["cryptopedia-db-v1"];
const DEFAULT_ART_KIND = "rakshasa";
const CREATURE_ART_BY_SLUG = {
  rakshasa: "rakshasa",
  wendigo: "wendigo",
  "mokele-mbembe": "mokele",
  unicorn: "unicorn",
  kitsune: "kitsune",
  minotaur: "minotaur",
  naga: "naga",
  kelpie: "kelpie"
};

const body = document.body;
const page = body.dataset.page || "home";

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHTML(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function joinLines(value = "") {
  return value
    .split(/\n\s*\n/g)
    .map((block) => `<p>${escapeHTML(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function formatDate(value) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatDateTime(value) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function normalize(value = "") {
  return String(value).toLowerCase();
}

function idle(callback, timeout = 1200) {
  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, { timeout });
  }
  return window.setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 0 }), 180);
}

function cancelIdle(handle) {
  if ("cancelIdleCallback" in window) {
    window.cancelIdleCallback(handle);
    return;
  }
  clearTimeout(handle);
}

function svgData(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function creatureSilhouette(kind, accent = "#b89a67") {
  const common = {
    moon: `<circle cx="860" cy="170" r="90" fill="rgba(236,242,255,0.82)"/><circle cx="890" cy="150" r="90" fill="rgba(5,8,13,0.46)"/>`,
    haze: `<ellipse cx="630" cy="650" rx="500" ry="110" fill="rgba(193,212,240,0.11)"/><ellipse cx="720" cy="690" rx="430" ry="78" fill="rgba(193,212,240,0.08)"/>`,
    trees: `<path d="M0,700 C80,650 120,560 190,520 C240,490 290,540 320,500 C370,444 420,498 470,448 C520,405 560,435 620,390 L620,900 L0,900 Z" fill="rgba(4,8,12,0.92)"/><path d="M520,900 L590,620 L660,900 Z" fill="rgba(3,6,10,0.9)"/><path d="M620,900 L700,560 L770,900 Z" fill="rgba(4,8,12,0.92)"/><path d="M760,900 L825,640 L905,900 Z" fill="rgba(3,6,10,0.94)"/><path d="M900,900 L975,595 L1060,900 Z" fill="rgba(4,8,12,0.92)"/><path d="M1030,900 L1115,620 L1200,900 Z" fill="rgba(3,6,10,0.9)"/><path d="M1180,900 L1260,650 L1340,900 Z" fill="rgba(4,8,12,0.92)"/>`
  };

  const variants = {
    rakshasa: `
      <g transform="translate(0,0)">
        <path d="M632 660 C620 604 618 556 636 506 C656 451 698 418 760 410 C824 402 876 429 908 478 C930 512 936 558 928 612 C922 651 904 692 878 724 L744 724 C715 703 652 691 632 660Z" fill="rgba(4,6,10,0.97)"/>
        <path d="M690 425 C670 394 675 360 702 337 C719 323 737 320 753 326 C745 342 744 360 752 379 C737 395 723 409 712 429Z" fill="rgba(4,6,10,0.97)"/>
        <path d="M872 430 C890 400 888 365 862 340 C846 325 826 320 810 326 C818 343 819 362 811 380 C827 394 840 410 852 430Z" fill="rgba(4,6,10,0.97)"/>
        <path d="M732 528 C736 490 781 472 816 480 C849 489 870 515 868 544 C860 597 740 598 732 528Z" fill="rgba(30,38,49,0.34)"/>
        <circle cx="774" cy="532" r="10" fill="${accent}"/>
        <circle cx="830" cy="532" r="10" fill="${accent}"/>
      </g>`,
    wendigo: `
      <g transform="translate(0,0)">
        <path d="M715 742 C682 680 684 604 704 548 C721 500 759 462 806 450 C859 438 908 454 936 494 C963 534 966 598 946 652 C935 683 918 715 896 742 L715 742 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M711 489 C682 448 666 412 669 379 C703 388 737 410 760 442 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M860 441 C888 410 923 390 956 381 C960 415 942 448 916 489 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M640 400 C660 362 694 338 736 328 C744 354 739 381 728 408 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M936 406 C926 376 926 350 938 327 C981 338 1012 363 1031 402 Z" fill="rgba(4,7,10,0.98)"/>
        <circle cx="777" cy="534" r="8" fill="#e3ecef"/>
        <circle cx="845" cy="532" r="8" fill="#e3ecef"/>
      </g>`,
    mokele: `
      <g transform="translate(0,0)">
        <path d="M634 682 C638 639 680 612 721 603 C751 596 789 598 817 584 C853 566 872 527 912 507 C951 487 1002 484 1040 505 C1090 533 1112 589 1105 646 C1099 687 1076 721 1040 744 L692 744 C657 732 628 711 634 682Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M730 608 C688 585 668 545 669 504 C720 502 758 520 790 551 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M924 520 C952 484 967 450 968 414 C1007 433 1030 464 1042 504 Z" fill="rgba(4,7,10,0.98)"/>
        <circle cx="987" cy="522" r="7" fill="${accent}"/>
      </g>`,
    unicorn: `
      <g transform="translate(0,0)">
        <path d="M670 720 C644 677 643 611 661 558 C680 499 720 456 776 440 C843 421 914 452 949 512 C976 559 976 623 954 673 C943 698 925 717 904 733 L730 733 C712 729 688 724 670 720Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M742 446 C748 407 768 375 799 350 C815 378 819 409 814 439 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M803 344 L825 286 L836 348 Z" fill="${accent}"/>
        <path d="M696 524 C714 487 749 470 786 468 C822 466 857 479 881 506 C852 517 819 523 781 524 Z" fill="rgba(27,36,48,0.34)"/>
      </g>`,
    kitsune: `
      <g transform="translate(0,0)">
        <path d="M700 731 C667 694 663 645 675 601 C690 544 725 498 773 472 C822 445 885 447 929 481 C967 510 987 560 989 612 C992 667 973 706 944 733 L700 733 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M736 540 C688 502 661 456 650 406 C705 422 745 445 777 476 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M824 463 C829 428 845 397 872 374 C887 400 891 430 886 462 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M929 516 C971 528 1006 553 1032 591 C1002 606 967 610 932 603 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M903 560 C949 580 989 615 1018 662 C986 674 951 674 916 663 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M835 582 C890 611 932 654 960 713 C925 720 888 715 850 697 Z" fill="rgba(4,7,10,0.98)"/>
        <circle cx="832" cy="548" r="7" fill="${accent}"/>
      </g>`,
    minotaur: `
      <g transform="translate(0,0)">
        <path d="M640 722 C635 684 644 645 660 608 C681 560 713 520 756 494 C805 464 861 455 914 471 C961 484 998 520 1017 570 C1034 615 1033 674 1017 722 L640 722 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M690 497 C662 469 652 441 654 409 C690 408 724 417 754 438 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M901 438 C931 416 964 408 1000 409 C1000 442 989 471 960 497 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M678 418 C706 376 746 354 798 346 C800 372 789 397 770 419 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M944 419 C928 395 922 370 926 344 C978 351 1017 374 1045 418 Z" fill="rgba(4,7,10,0.98)"/>
        <circle cx="798" cy="544" r="10" fill="${accent}"/>
        <circle cx="854" cy="544" r="10" fill="${accent}"/>
      </g>`,
    naga: `
      <g transform="translate(0,0)">
        <path d="M586 668 C620 605 676 590 733 602 C792 614 841 657 893 674 C955 695 1020 683 1081 639 C1117 613 1142 579 1150 539 C1160 486 1131 444 1088 426 C1043 407 984 412 930 434 C869 460 821 507 757 522 C695 537 642 524 602 494 C571 471 548 430 552 381 C600 395 642 422 678 456 C717 493 760 514 804 511 C848 508 887 486 930 462 C979 435 1040 420 1090 428 C1150 438 1206 485 1210 555 C1214 613 1182 668 1135 706 C1072 757 987 765 912 741 C835 716 781 665 721 654 C658 642 618 664 586 720 Z" fill="rgba(4,7,10,0.98)"/>
        <circle cx="1092" cy="471" r="7" fill="${accent}"/>
      </g>`,
    kelpie: `
      <g transform="translate(0,0)">
        <path d="M668 716 C646 688 639 648 645 610 C653 559 682 514 723 487 C775 454 842 445 899 462 C952 478 993 518 1014 571 C1035 623 1033 679 1016 719 L668 719 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M741 489 C735 448 749 415 781 388 C796 415 798 447 792 481 Z" fill="rgba(4,7,10,0.98)"/>
        <path d="M637 727 C663 709 692 699 722 697 C799 690 860 707 925 702 C981 698 1032 687 1082 660 C1098 703 1096 731 1079 748 L636 748 Z" fill="rgba(17,24,33,0.62)"/>
        <path d="M797 436 C802 404 817 374 843 350 C855 378 856 407 851 438 Z" fill="rgba(4,7,10,0.98)"/>
        <circle cx="809" cy="521" r="7" fill="${accent}"/>
      </g>`
  };

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#0b1525"/>
          <stop offset="58%" stop-color="#0a1018"/>
          <stop offset="100%" stop-color="#040507"/>
        </linearGradient>
        <radialGradient id="moonGlow" cx="68%" cy="18%" r="34%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.95)"/>
          <stop offset="36%" stop-color="rgba(220,234,255,0.36)"/>
          <stop offset="100%" stop-color="rgba(220,234,255,0)"/>
        </radialGradient>
        <linearGradient id="mist" x1="0" x2="1">
          <stop offset="0%" stop-color="rgba(179,202,232,0.02)"/>
          <stop offset="50%" stop-color="rgba(179,202,232,0.16)"/>
          <stop offset="100%" stop-color="rgba(179,202,232,0.02)"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#sky)"/>
      <circle cx="850" cy="175" r="160" fill="url(#moonGlow)"/>
      <circle cx="860" cy="170" r="86" fill="rgba(236,242,255,0.88)"/>
      <circle cx="892" cy="145" r="86" fill="rgba(7,11,16,0.62)"/>
      <path d="M0 690 C120 640 230 648 318 606 C394 570 445 494 518 470 C600 443 688 482 758 454 C823 428 892 356 1002 372 C1094 385 1146 463 1200 523 L1200 900 L0 900 Z" fill="rgba(5,8,12,0.9)"/>
      <path d="M0 760 C122 702 225 721 318 687 C397 657 463 583 539 554 C615 525 696 548 766 522 C848 491 912 423 1006 430 C1093 436 1156 489 1200 542 L1200 900 L0 900 Z" fill="rgba(4,6,10,0.96)"/>
      ${common.trees}
      ${common.haze}
      ${variants[kind] || variants.rakshasa}
      <path d="M0 780 C158 738 315 762 454 730 C594 698 739 709 871 684 C1002 659 1110 639 1200 595 L1200 900 L0 900 Z" fill="url(#mist)"/>
    </svg>
  `;
}

function makeCreatureArt(creature) {
  const accentMap = {
    rakshasa: "#caa36c",
    wendigo: "#e6eef7",
    mokele: "#8ec6da",
    unicorn: "#d6e8ff",
    kitsune: "#d8a46d",
    minotaur: "#b68a5c",
    naga: "#8ec7b0",
    kelpie: "#8eb0d8"
  };
  return svgData(creatureSilhouette(creature.artKind, accentMap[creature.artKind] || "#c0d5ef"));
}

function getCreatureArtKind(creature) {
  return creature.artKind || CREATURE_ART_BY_SLUG[creature.slug] || DEFAULT_ART_KIND;
}

function resolveCreatureImage(creature) {
  if (creature.imageUrl) return creature.imageUrl;
  return makeCreatureArt({ artKind: getCreatureArtKind(creature) });
}

function normalizeLogDocuments(documents) {
  if (!Array.isArray(documents)) return [];
  return documents
    .map((doc) => ({
      id: doc?.id || uid("pdf"),
      name: String(doc?.name || "Archive PDF"),
      url: String(doc?.url || ""),
      addedAt: String(doc?.addedAt || new Date().toISOString())
    }))
    .filter((doc) => doc.url);
}

function normalizeLogEntries(entries) {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry) => ({
      id: entry?.id || uid("log"),
      heading: String(entry?.heading || "Untitled Log"),
      description: String(entry?.description || ""),
      pdfName: String(entry?.pdfName || entry?.name || "Archive PDF"),
      pdfUrl: String(entry?.pdfUrl || entry?.url || ""),
      addedAt: String(entry?.addedAt || new Date().toISOString())
    }))
    .filter((entry) => entry.heading || entry.pdfUrl || entry.description);
}

function migrateCreatureRecord(creature) {
  const artKind = getCreatureArtKind(creature);
  const migrated = { ...creature, artKind };
  if (typeof migrated.imageUrl === "string" && migrated.imageUrl.startsWith("data:image/svg+xml")) {
    migrated.imageUrl = "";
  }
  if (Array.isArray(migrated.archiveFiles)) {
    migrated.archiveFiles = migrated.archiveFiles.map((file) =>
      file.kind === "logs"
        ? {
            ...file,
            documents: undefined,
            entries: normalizeLogEntries(
              Array.isArray(file.entries)
                ? file.entries
                : normalizeLogDocuments(file.documents).map((doc) => ({
                    id: doc.id,
                    heading: doc.name,
                    description: "",
                    pdfName: doc.name,
                    pdfUrl: doc.url,
                    addedAt: doc.addedAt
                  }))
            )
          }
        : file
    );
  }
  return migrated;
}

function makeMoonlitBackgroundArt() {
  return `
    <svg class="moonlit-background__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bgSky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#0c1726"/>
          <stop offset="58%" stop-color="#09101a"/>
          <stop offset="100%" stop-color="#030406"/>
        </linearGradient>
        <radialGradient id="bgMoonGlow" cx="74%" cy="15%" r="36%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.9)"/>
          <stop offset="32%" stop-color="rgba(221,235,255,0.34)"/>
          <stop offset="100%" stop-color="rgba(221,235,255,0)"/>
        </radialGradient>
        <linearGradient id="bgMist" x1="0" x2="1">
          <stop offset="0%" stop-color="rgba(176,198,226,0.02)"/>
          <stop offset="50%" stop-color="rgba(176,198,226,0.16)"/>
          <stop offset="100%" stop-color="rgba(176,198,226,0.02)"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="1200" fill="url(#bgSky)"/>
      <circle cx="1180" cy="200" r="220" fill="url(#bgMoonGlow)"/>
      <circle cx="1200" cy="185" r="122" fill="rgba(236,242,255,0.88)"/>
      <circle cx="1240" cy="150" r="122" fill="rgba(6,10,15,0.62)"/>
      <path d="M0 760 C150 700 300 690 430 640 C568 587 620 500 732 474 C852 446 957 495 1072 468 C1188 441 1292 352 1420 372 C1496 384 1542 447 1600 508 L1600 1200 L0 1200 Z" fill="rgba(5,8,11,0.9)"/>
      <path d="M0 860 C170 804 312 812 432 764 C550 718 624 626 726 590 C830 552 941 585 1041 556 C1144 526 1238 440 1362 446 C1461 451 1524 504 1600 565 L1600 1200 L0 1200 Z" fill="rgba(4,6,9,0.96)"/>
      <path d="M0 980 C120 946 214 932 312 894 C422 852 474 780 586 732 C694 686 822 700 928 664 C1036 628 1120 564 1230 560 C1356 554 1460 612 1600 678 L1600 1200 L0 1200 Z" fill="rgba(3,5,8,0.98)"/>
      <path d="M0 720 C80 676 124 592 184 534 C224 494 272 486 304 450 C336 413 342 350 376 312 C420 263 486 256 520 222 C560 185 568 120 596 88 C620 60 664 42 700 36 L700 1200 L0 1200 Z" fill="rgba(3,5,8,0.88)"/>
      <path d="M700 1200 L700 344 C748 376 784 428 820 486 C857 546 894 600 940 640 C1002 695 1084 714 1160 744 C1220 768 1288 818 1360 918 C1402 976 1454 1040 1600 1120 L1600 1200 Z" fill="rgba(4,7,10,0.94)"/>
      <path d="M1600 1200 L1600 380 C1544 360 1496 370 1450 406 C1392 452 1362 516 1318 572 C1278 623 1228 662 1168 688 C1090 724 1012 748 936 804 C862 858 800 946 760 1200 Z" fill="rgba(3,5,7,0.96)"/>
      <path d="M0 1080 C230 1030 410 1050 588 1028 C748 1008 882 980 1034 952 C1192 922 1350 900 1600 828 L1600 1200 L0 1200 Z" fill="url(#bgMist)"/>
      <path d="M0 1120 C260 1092 472 1106 658 1090 C830 1076 987 1042 1162 1026 C1328 1012 1460 998 1600 960 L1600 1200 L0 1200 Z" fill="rgba(174,197,227,0.06)"/>
    </svg>
  `;
}

function makeSymbolArt(text, palette = ["#d6e8ff", "#10161e"]) {
  const primary = palette[0];
  const secondary = palette[1];
  return svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <radialGradient id="g" cx="35%" cy="30%" r="72%">
          <stop offset="0%" stop-color="${primary}" stop-opacity="0.95"/>
          <stop offset="70%" stop-color="${primary}" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="${secondary}" stop-opacity="0.05"/>
        </radialGradient>
      </defs>
      <rect width="512" height="512" rx="120" fill="#0c1118"/>
      <circle cx="256" cy="256" r="172" fill="url(#g)"/>
      <circle cx="256" cy="256" r="136" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="8"/>
      <text x="256" y="290" text-anchor="middle" font-family="Georgia, serif" font-size="168" fill="${primary}">${text}</text>
    </svg>
  `);
}

function getInitialDB() {
  const pantheons = [
    {
      id: "hindu",
      name: "Hindu / Indian",
      description: "A broad archive of devas, rakshasas, naga lineages, guardians, and shape-shifting beings from South and South-East Asian traditions.",
      symbolText: "ॐ",
      symbolImageUrl: "",
      famousCreatures: ["Rakshasa", "Naga", "Vetala"],
      sortOrder: 1
    },
    {
      id: "greek",
      name: "Greek / Roman",
      description: "Myths of marble temples, labyrinths, omens, and beasts bound to prophecy, hubris, and divine punishment.",
      symbolText: "⚡",
      symbolImageUrl: "",
      famousCreatures: ["Minotaur", "Hydra", "Cerberus"],
      sortOrder: 2
    },
    {
      id: "norse",
      name: "Norse / Germanic",
      description: "Runic lore, frostbound giants, and forest omens tied to old paths, sacrifice, and the shadow of Yggdrasil.",
      symbolText: "ᛟ",
      symbolImageUrl: "",
      famousCreatures: ["Jörmungandr", "Fenrir", "Huldra"],
      sortOrder: 3
    },
    {
      id: "egyptian",
      name: "Egyptian",
      description: "Ancient guardians, sacred horizons, and vigilant symbols of protection, judgment, and the underworld.",
      symbolText: "𓂀",
      symbolImageUrl: "",
      famousCreatures: ["Ammit", "Bastet", "Apep"],
      sortOrder: 4
    },
    {
      id: "yokai",
      name: "Japanese / Yokai",
      description: "Torii shadows, fox-fire, masks, and entities that drift between blessing, trickery, and haunting beauty.",
      symbolText: "⛩",
      symbolImageUrl: "",
      famousCreatures: ["Kitsune", "Tengu", "Nure-onna"],
      sortOrder: 5
    },
    {
      id: "celtic",
      name: "Celtic / British Isles",
      description: "Old wells, moors, ringforts, and the silver edge of stories that survive through songs and winter roads.",
      symbolText: "☘",
      symbolImageUrl: "",
      famousCreatures: ["Unicorn", "Kelpie", "Púca"],
      sortOrder: 6
    },
    {
      id: "slavic",
      name: "Slavic",
      description: "A record of birch forests, firebirds, and house spirits where folklore still feels near enough to hear.",
      symbolText: "🔥",
      symbolImageUrl: "",
      famousCreatures: ["Baba Yaga", "Rusalka", "Firebird"],
      sortOrder: 7
    },
    {
      id: "mesopotamian",
      name: "Mesopotamian / Middle Eastern",
      description: "Clay tablets, winged lions, and storm-borne gods from some of humanity's oldest narrative strata.",
      symbolText: "𒀭",
      symbolImageUrl: "",
      famousCreatures: ["Lamassu", "Anzu", "Pazuzu"],
      sortOrder: 8
    },
    {
      id: "indigenous",
      name: "Indigenous Americas",
      description: "Cold valleys, ceremonial paths, and cautionary figures that bind land, hunger, and memory together.",
      symbolText: "⛰",
      symbolImageUrl: "",
      famousCreatures: ["Wendigo", "Thunderbird", "Skinwalker"],
      sortOrder: 9
    },
    {
      id: "african",
      name: "African Mythology & Cryptids",
      description: "River systems, baobab shadows, masks, and surviving accounts of enigmatic beasts across the continent.",
      symbolText: "◌",
      symbolImageUrl: "",
      famousCreatures: ["Mokele-Mbembe", "Adze", "Grootslang"],
      sortOrder: 10
    }
  ];

  const types = [
    {
      id: "mystical",
      name: "Mystical Beasts",
      description: "Entities with luminous, otherworldly, or enchantment-linked behavior that resists ordinary zoology.",
      symbolText: "✦",
      symbolImageUrl: "",
      sortOrder: 1
    },
    {
      id: "humanoid",
      name: "Humanoids",
      description: "Bipedal, intelligent, or human-adjacent forms with speech, craft, ritual, or social presence.",
      symbolText: "◈",
      symbolImageUrl: "",
      sortOrder: 2
    },
    {
      id: "predatory",
      name: "Cannibalistic / Predatory",
      description: "Threat profiles marked by stalking, predation, territorial aggression, or documented human harm.",
      symbolText: "⚔",
      symbolImageUrl: "",
      sortOrder: 3
    },
    {
      id: "docile",
      name: "Docile / Helpful",
      description: "Rare beings that guide, protect, or coexist when treated with reverence or caution.",
      symbolText: "☾",
      symbolImageUrl: "",
      sortOrder: 4
    },
    {
      id: "living-fossil",
      name: "Living Fossils / Anomalous Survivors",
      description: "Species or forms that appear ancient, persistent, or displaced from the expected timeline of nature.",
      symbolText: "𓆣",
      symbolImageUrl: "",
      sortOrder: 5
    }
  ];

  const creatures = [
    {
      id: uid("creature"),
      slug: "rakshasa",
      name: "Rakshasa",
      aliases: ["Rākṣasa", "Night Veiler", "Temple Hunter"],
      pantheonId: "hindu",
      region: "Indian subcontinent; temple ruins, cremation grounds, forest roads",
      biologicalForm: "Humanoid, shape-shifting, clawed and fanged predator",
      typeIds: ["humanoid", "predatory", "mystical"],
      threatLevel: "Extreme",
      status: "Uncontained / Disputed",
      habitat: "Border forests, abandoned shrines, ancient battlements",
      activityTime: "Nocturnal",
      summary: "A cunning entity spoken of in epics as a deceiver, devourer, and guardian of taboo thresholds.",
      artKind: "rakshasa",
      imageUrl: "",
      recentlyUpdated: true,
      updatedAt: "2026-05-20T18:40:00Z",
      archiveFiles: [
        {
          kind: "history",
          title: "History & Cultural Significance",
          updatedAt: "2026-05-20T18:40:00Z",
          content:
            "Rakshasas occupy a wide moral and symbolic range in Indian literature, from temple-guarding antagonists to night-walking intellects shaped by hunger, grief, and disciplined power. In the archive, the creature is treated not as a single species but as a broad class of beings whose stories repeatedly test the boundary between order and appetite. Their presence in epics, courtly legends, and devotional retellings often emphasizes disguise, rhetoric, and the danger of reading a face as a guarantee of intent.\n\nModern folkloric reports retain that ambiguity. Witnesses describe a being capable of adopting familiar voices, moving with unnerving patience, and appearing most often at sites where ritual history has been neglected or violated. As with many archive entries, the symbolic weight is as important as the zoological claim: the Rakshasa is a reminder that a cultured mask can conceal the oldest hunger."
        },
        {
          kind: "sightings",
          title: "Recent Sightings & Hiker Accounts",
          updatedAt: "2026-05-21T09:15:00Z",
          content:
            "Field note, foothills outside an abandoned shrine: a group of three hikers reported a tall man in dry leaves who never seemed to step directly on the ground. One account describes a voice calling from the tree line in the exact cadence of a missing companion. The subject was seen with red-orange eyeshine and an irregular shadow, as if the light could not decide where the body ended.\n\nNo physical traces were recovered beyond a set of long, shallow gouges in a sandstone wall. Tracks were inconclusive."
        },
        {
          kind: "logs",
          title: "Logs",
          updatedAt: "2026-05-22T23:20:00Z",
          recentlyUpdated: true,
          content:
            "I reached the ruin before midnight and found the altar stone warm, though the air was cold enough to sting the nose. The forest had gone quiet in the way it does before rain, but there was no weather in the sky above the valley. I heard footsteps pacing me from the west wall; when I turned, the sound stopped. The eyes came last, then a smile where no face should have been. I wrote the coordinates down with shaking hands and left before dawn. Whatever watched from the trees knew my name."
        }
      ]
    },
    {
      id: uid("creature"),
      slug: "wendigo",
      name: "Wendigo",
      aliases: ["Windigo", "Witiko", "Winter Hunger"],
      pantheonId: "indigenous",
      region: "Northern forests and frozen interior basins of North America",
      biologicalForm: "Emaciated humanoid predator with antler growth and elongated limbs",
      typeIds: ["humanoid", "predatory"],
      threatLevel: "Extreme",
      status: "Active / Seasonal",
      habitat: "Deep woods, frozen lakeshores, starvation zones",
      activityTime: "Dusk through predawn",
      summary: "A famine-warped form associated with winter taboo, greed, isolation, and the erosion of communal restraint.",
      artKind: "wendigo",
      imageUrl: "",
      recentlyUpdated: false,
      updatedAt: "2026-05-18T12:10:00Z",
      archiveFiles: [
        {
          kind: "history",
          title: "History & Cultural Significance",
          updatedAt: "2026-05-18T12:10:00Z",
          content:
            "The Wendigo is documented in oral traditions as a warning against destructive hunger, social collapse, and the abandonment of reciprocity. Older narratives do not reduce the figure to simple monster anatomy; instead, they treat the Wendigo as an outcome of moral rupture and extreme deprivation. In that sense, the archive reads it as both creature and condition.\n\nAccounts from later eras often simplify the legend into a skeletal forest predator, yet the deeper tradition consistently ties the being to cold, isolation, and the dangerous idea that appetite can become identity. Where the story survives with force, it does so as an ethic: consume too much, refuse to share, and the forest may eventually answer back."
        },
        {
          kind: "sightings",
          title: "Recent Sightings & Hiker Accounts",
          updatedAt: "2026-05-24T04:45:00Z",
          recentlyUpdated: true,
          content:
            "Search teams near a frozen ridgeline reported a moving figure that never crossed open snow directly. Instead, it seemed to appear where the trees were thickest and the wind was sharpest. One hiker wrote that the eyes were too bright and too empty at once. The subject moved with a slow, deliberate gait, pausing whenever a flashlight beam touched the trunks.\n\nThe crew withdrew after hearing bone-like clicks from the ravine below the trail."
        },
        {
          kind: "logs",
          title: "Logs",
          updatedAt: "2026-05-24T20:05:00Z",
          content:
            "At 2:14 a.m. the snow started falling in flakes too large to be natural, and every footprint behind me filled in before I reached the next bend. I kept hearing a second breathing pattern under my own. When I finally looked over my shoulder, I saw nothing except antler shapes against the fir line. Then something called from behind my campsite, using the same words I had spoken an hour earlier. I left the stove running and did not return for the equipment."
        }
      ]
    },
    {
      id: uid("creature"),
      slug: "mokele-mbembe",
      name: "Mokele-Mbembe",
      aliases: ["River Brute", "Swamp Thunder", "Mokele"],
      pantheonId: "african",
      region: "Congo Basin wetlands, river channels, flooded forest margins",
      biologicalForm: "Large semi-aquatic saurian or sauropod-like anomalous survivor",
      typeIds: ["living-fossil", "mystical"],
      threatLevel: "High",
      status: "Unconfirmed / Mobile",
      habitat: "River bends, deep swamps, submerged channels",
      activityTime: "Crepuscular",
      summary: "A persistent river legend associated with large wakes, overturned canoes, and a distant body plan that resists easy taxonomy.",
      artKind: "mokele",
      imageUrl: "",
      recentlyUpdated: true,
      updatedAt: "2026-05-23T16:00:00Z",
      archiveFiles: [
        {
          kind: "history",
          title: "History & Cultural Significance",
          updatedAt: "2026-05-23T16:00:00Z",
          content:
            "Mokele-Mbembe belongs to the class of river legends that persist where water, distance, and dense canopy make verification difficult. The archive treats the creature as a cultural and ecological composite: a story that gathers fears about deep channels, unknown loudness, and the possibility of a large living thing remaining outside formal survey.\n\nDescriptions vary from reptilian to sauropod-like, but the through-line remains consistent. The being is large, solitary, and deeply tied to waterways that communities already treat with respect. Whether or not a single zoological animal lies behind the reports, the legend functions as a map of caution and awe."
        },
        {
          kind: "sightings",
          title: "Recent Sightings & Hiker Accounts",
          updatedAt: "2026-05-25T06:30:00Z",
          content:
            "A boat crew recorded a wake moving upstream against the current after sunrise, with no visible cause and no bird scatter nearby. A local guide described a smell of wet mineral and vegetation that lingered over the water for nearly ten minutes. Later, a line of reeds was pressed down in a broad curve matching the width of a large body.\n\nNo sound was heard besides the river itself and a low, slow exhale."
        },
        {
          kind: "logs",
          title: "Logs",
          updatedAt: "2026-05-25T21:14:00Z",
          recentlyUpdated: true,
          content:
            "We crossed the channel at dawn and saw the bank bow outward where nothing had touched it. The villagers had warned me not to stare into the water too long, and I assumed it was ceremony. It was not. Something moved under the surface with enough mass to tilt the canoe. I saw the ridge of its back for a heartbeat, then the water closed like a wound. I have spent twenty years documenting the unknown, and this was the first time I believed the unknown might have been documenting me."
        }
      ]
    },
    {
      id: uid("creature"),
      slug: "unicorn",
      name: "Unicorn",
      aliases: ["Horned One", "White Stag Lineage", "Forest Bridegroom"],
      pantheonId: "celtic",
      region: "Woodlands, old roads, and liminal glades across Europe and the British Isles",
      biologicalForm: "Equine-bodied beast with a singular horn and luminous mane",
      typeIds: ["mystical", "docile"],
      threatLevel: "Low",
      status: "Rare / Protective",
      habitat: "Old forests, sacred springs, high clearings",
      activityTime: "Moonrise to dawn",
      summary: "A heraldic and devotional creature associated with purity, sovereignty, and the perilous grace of impossible gentleness.",
      artKind: "unicorn",
      imageUrl: "",
      recentlyUpdated: false,
      updatedAt: "2026-05-16T10:14:00Z",
      archiveFiles: [
        {
          kind: "history",
          title: "History & Cultural Significance",
          updatedAt: "2026-05-16T10:14:00Z",
          content:
            "The Unicorn appears in medieval bestiaries, devotional imagery, and courtly allegory as a beast of sovereignty and impossible refinement. The archive keeps that symbolism intact while noting that folklore often frames the creature as fierce, not merely gentle. In some traditions the Unicorn can only be approached by the innocent or those acting under a righteous purpose.\n\nIts cultural persistence owes as much to emblematic power as to supposed sightings. The creature is a signature of purity, yes, but also of independence, punishment for greed, and the forests that refuse to be domesticated."
        },
        {
          kind: "sightings",
          title: "Recent Sightings & Hiker Accounts",
          updatedAt: "2026-05-18T22:05:00Z",
          content:
            "A shepherd reported a white animal standing at the edge of a spring, head lowered as though listening to the water. When approached, it did not flee; it stepped aside and vanished between two alder trunks. No hoofprints were found in the soft ground, only a shallow oval impression where the spring had overflowed.\n\nThe witness described a smell like rain on stone and a sound “like a bell wrapped in leaves.”"
        },
        {
          kind: "logs",
          title: "Logs",
          updatedAt: "2026-05-18T23:30:00Z",
          content:
            "I found the clearing after the moon cleared the ridge. The animal was already there, drinking without ripples, and it did not look up when I stepped into view. I had expected fear, or at least distance, but instead felt a kind of quiet instruction. It turned only once, enough for me to see the horn and the dark intelligence in the eye. Then it crossed the stream in three measured steps and left the water untouched."
        }
      ]
    },
    {
      id: uid("creature"),
      slug: "kitsune",
      name: "Kitsune",
      aliases: ["Fox Spirit", "Kiko", "Nine-Tail Messenger"],
      pantheonId: "yokai",
      region: "Japan; shrine grounds, cedar forests, rural roads, and abandoned crossings",
      biologicalForm: "Shapeshifting fox spirit / humanoid trickster entity",
      typeIds: ["mystical", "humanoid", "docile"],
      threatLevel: "Moderate",
      status: "Active / Variable Intent",
      habitat: "Shrines, rice terraces, forest edges, old villages",
      activityTime: "Dusk",
      summary: "A luminous shapeshifter known for cleverness, devotion, and the thin line between benevolence and mischief.",
      artKind: "kitsune",
      imageUrl: "",
      recentlyUpdated: true,
      updatedAt: "2026-05-25T09:30:00Z",
      archiveFiles: [
        {
          kind: "history",
          title: "History & Cultural Significance",
          updatedAt: "2026-05-25T09:30:00Z",
          content:
            "Kitsune stories occupy a flexible role in Japanese folklore, ranging from shrine messengers and household protectors to deceptive tricksters and dangerous romantic figures. The archive emphasizes this duality because the creature's cultural value depends on it: one form may shelter, another may test, and both can be true without contradiction.\n\nThe fox is often tied to thresholds, bargains, and transformation. In this record, the Kitsune is not reduced to a single moral label but understood as a being whose intelligence exceeds simple classification."
        },
        {
          kind: "sightings",
          title: "Recent Sightings & Hiker Accounts",
          updatedAt: "2026-05-26T03:20:00Z",
          recentlyUpdated: true,
          content:
            "A shrine keeper noticed three foxes watching the path from the same stone at different times of evening, though the stone was too narrow to hold them all. Another witness saw a woman with wet hair standing under the torii, who smiled once and then appeared on the other side of the road without crossing it. The air carried a scent of cedar smoke and plum blossom.\n\nNo hostile activity was confirmed. The witness reported the sensation of being evaluated, not threatened."
        },
        {
          kind: "logs",
          title: "Logs",
          updatedAt: "2026-05-26T03:55:00Z",
          content:
            "I was not surprised when the fox followed me. I was surprised that it knew which bridge I intended to cross before I chose the direction. By the time I reached the shrine steps, there were three sets of paws in the dust, then six, then none at all. A voice from the cedars asked whether I had come for wisdom or proof. I answered honestly that I had come for both, and the answer was a laugh I have not heard in any human throat."
        }
      ]
    },
    {
      id: uid("creature"),
      slug: "minotaur",
      name: "Minotaur",
      aliases: ["Asterion", "Bull of the Labyrinth", "Labyrinth Guardian"],
      pantheonId: "greek",
      region: "Crete; labyrinth sites, ruined forts, and subterranean passages",
      biologicalForm: "Bull-headed humanoid entity with immense physical mass",
      typeIds: ["humanoid", "predatory"],
      threatLevel: "High",
      status: "Contained / Mythic",
      habitat: "Maze-like ruins, undercrofts, hidden chambers",
      activityTime: "Any hour in enclosed darkness",
      summary: "A classic archive entity of enclosure, appetite, and the terror of becoming what one was built to hold.",
      artKind: "minotaur",
      imageUrl: "",
      recentlyUpdated: false,
      updatedAt: "2026-05-10T19:44:00Z",
      archiveFiles: [
        {
          kind: "history",
          title: "History & Cultural Significance",
          updatedAt: "2026-05-10T19:44:00Z",
          content:
            "The Minotaur is one of the archive's most structurally important figures because it binds architecture, punishment, and inherited violence into a single form. In Greek tradition the beast is linked to the labyrinth: an engineered space of misdirection in which human agency and monstrous appetite become inseparable.\n\nLater interpretations often moralize the creature as a simple beast. The archive instead preserves the older tension: the Minotaur is both victim and threat, a body that reveals what happens when power attempts to hide its failures underground."
        },
        {
          kind: "sightings",
          title: "Recent Sightings & Hiker Accounts",
          updatedAt: "2026-05-12T05:40:00Z",
          content:
            "A tourist party entering a sealed undercroft reported low breathing behind the stonework and repeated impacts against a corridor wall. The sound appeared to move with them despite multiple turns and two dead ends. Later, one member claimed to see broad horns in the dark reflected in a polished floor tile.\n\nThe group exited after hearing a heavy scrape followed by a single, human-like exhale."
        },
        {
          kind: "logs",
          title: "Logs",
          updatedAt: "2026-05-12T22:10:00Z",
          content:
            "I have crawled through catacombs that smelled like wet copper and old incense, but the chamber beneath the western foundation was different. Something lived there with the patient anger of a locked room. It did not rush me. It followed my torchlight, keeping pace in the passages where the walls narrowed, and when I finally saw its face I understood why the old stories built corridors instead of roads. No road can forgive a creature like that."
        }
      ]
    },
    {
      id: uid("creature"),
      slug: "naga",
      name: "Naga",
      aliases: ["Nāga", "Serpent Protector", "River King"],
      pantheonId: "hindu",
      region: "India, Nepal, Southeast Asia; rivers, wells, and underground chambers",
      biologicalForm: "Serpentine or half-humanoid guardian with ancestral memory",
      typeIds: ["mystical", "humanoid", "living-fossil"],
      threatLevel: "Moderate",
      status: "Active / Venerated",
      habitat: "Waterways, caves, temple reservoirs, subterranean vaults",
      activityTime: "Night and monsoon hours",
      summary: "A guardian-serpent concept that spans reverence, lineage, water power, and the lore of hidden depth.",
      artKind: "naga",
      imageUrl: "",
      recentlyUpdated: false,
      updatedAt: "2026-05-11T13:10:00Z",
      archiveFiles: [
        {
          kind: "history",
          title: "History & Cultural Significance",
          updatedAt: "2026-05-11T13:10:00Z",
          content:
            "Nāga traditions are diverse and regionally specific, but they consistently link serpentine figures with water, fertility, protection, and ancestral continuity. The archive does not treat the Naga as a simple monster; it is more often a mediator, a keeper of depth, and a reminder that power can be both awe-inspiring and sheltering.\n\nIts forms vary from fully serpentine to partly human, reflecting a broader symbolic idea rather than a single zoological claim. The creature belongs to the oldest strata of archive material and continues to appear in local devotion, ritual art, and cautionary field testimony."
        },
        {
          kind: "sightings",
          title: "Recent Sightings & Hiker Accounts",
          updatedAt: "2026-05-15T18:12:00Z",
          content:
            "Villagers near a well reported a reflective surface that seemed to ripple without wind. A fisherman later described a pair of eyes watching from below the reeds, then a voice asking whether the river had been disturbed by outsiders. No hostility followed; instead the witness claimed the current changed direction for several seconds before resuming its course.\n\nThe report was filed alongside a sketch of coil marks on stone steps at the waterline."
        },
        {
          kind: "logs",
          title: "Logs",
          updatedAt: "2026-05-15T22:50:00Z",
          recentlyUpdated: true,
          content:
            "I placed the offering at the temple reservoir and watched the water go still in a circle around my hand. There was no breeze, but a ribbon of surface tension pulled away from the edge as if something beneath had exhaled. I heard a voice in the dark asking whether I had come to steal, or to ask. I told it the truth: I had come because the archive was incomplete. The response was silence so old it felt like permission."
        }
      ]
    },
    {
      id: uid("creature"),
      slug: "kelpie",
      name: "Kelpie",
      aliases: ["Water Horse", "River Skin", "Moor Rider"],
      pantheonId: "celtic",
      region: "Scottish lochs, river mouths, and peat-black marshland",
      biologicalForm: "Equine water entity with shapeshifting and drowning lure traits",
      typeIds: ["mystical", "predatory"],
      threatLevel: "High",
      status: "Active / Territorial",
      habitat: "Lochs, marshes, river bends, floodplains",
      activityTime: "Twilight and storm breaks",
      summary: "A beautiful hazard of the waterline, often arriving as a horse and leaving as an absence.",
      artKind: "kelpie",
      imageUrl: "",
      recentlyUpdated: false,
      updatedAt: "2026-05-13T08:20:00Z",
      archiveFiles: [
        {
          kind: "history",
          title: "History & Cultural Significance",
          updatedAt: "2026-05-13T08:20:00Z",
          content:
            "The Kelpie is one of the archive's clearest examples of a creature that operates as environmental warning and narrative magnet. It appears most often in places where footing is uncertain and travel is too casual. Stories typically give it the shape of a horse, but the deeper role is that of a boundary trap: it invites approach, then punishes complacency.\n\nIts cultural life remains strong because it translates practical water safety into a vivid, memorable form. The archive preserves both the folkloric beauty and the lethal intent."
        },
        {
          kind: "sightings",
          title: "Recent Sightings & Hiker Accounts",
          updatedAt: "2026-05-14T21:24:00Z",
          content:
            "Two hikers on a mossy track reported a glossy black mare standing knee-deep in the loch, though the water at that depth should have been much deeper. When one approached with a hand outstretched, the horse turned its head, and the skin along its neck seemed to tighten like wet leather. They ran when the animal began to step onto land without disturbing the reeds.\n\nLater, they found a strand of dark hair tangled on a fence post at chest height."
        },
        {
          kind: "logs",
          title: "Logs",
          updatedAt: "2026-05-14T23:42:00Z",
          content:
            "The mare waited at the edge of the water as if it had been there before I arrived and intended to remain after I left. Its reflection did not match the body in front of me. I remember thinking that the loch looked less like a surface and more like a mouth. When the creature stepped toward me, I saw the first hint of teeth beneath the wet lip line. I put the notebook away and backed into the heather without turning. The horse never hurried."
        }
      ]
    }
  ];

  return { pantheons, types, creatures };
}

function loadDB() {
  let raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const legacyRaw = localStorage.getItem(legacyKey);
      if (legacyRaw) {
        raw = legacyRaw;
        break;
      }
    }
  }
  if (!raw) {
    const seed = getInitialDB();
    saveDB(seed);
    return seed;
  }
  try {
    const parsed = JSON.parse(raw);
    const nextDB = {
      pantheons: Array.isArray(parsed.pantheons) ? parsed.pantheons : getInitialDB().pantheons,
      types: Array.isArray(parsed.types) ? parsed.types : getInitialDB().types,
      creatures: Array.isArray(parsed.creatures) ? parsed.creatures.map(migrateCreatureRecord) : getInitialDB().creatures
    };
    saveDB(nextDB);
    return nextDB;
  } catch {
    const seed = getInitialDB();
    saveDB(seed);
    return seed;
  }
}

function compactDB(nextDB) {
  return {
    ...nextDB,
    creatures: nextDB.creatures.map((creature) => {
      const compactCreature = migrateCreatureRecord(creature);
      return compactCreature;
    })
  };
}

function saveDB(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compactDB(db)));
  } catch (error) {
    const compact = compactDB(db);
    compact.creatures = compact.creatures.map((creature) => ({
      ...creature,
      imageUrl: creature.imageUrl?.startsWith("data:image/svg+xml") ? "" : creature.imageUrl
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
    console.warn("Cryptopedia storage was compacted after a localStorage write failed.", error);
  }
}

let db = loadDB();

function getPantheons() {
  return [...db.pantheons].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function getTypes() {
  return [...db.types].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function getCreatures() {
  return [...db.creatures].sort((a, b) => {
    const av = new Date(a.updatedAt || 0).getTime();
    const bv = new Date(b.updatedAt || 0).getTime();
    return bv - av;
  });
}

function getPantheon(id) {
  return db.pantheons.find((item) => item.id === id);
}

function getType(id) {
  return db.types.find((item) => item.id === id);
}

function getCreature(idOrSlug) {
  return db.creatures.find((item) => item.id === idOrSlug || item.slug === idOrSlug);
}

function creatureTags(creature) {
  return creature.typeIds.map((id) => getType(id)?.name).filter(Boolean);
}

function creaturePantheonName(creature) {
  return getPantheon(creature.pantheonId)?.name || "Unknown";
}

function creaturePreviewText(creature) {
  return creature.summary || creature.description || "";
}

function getArchiveFile(creature, kind) {
  return creature.archiveFiles.find((file) => file.kind === kind);
}

function renderLogEntries(entries = [], creatureName = "Creature") {
  if (!entries.length) return "";
  return `
    <div class="log-documents">
      ${entries
        .map(
          (entry) => `
            <article class="log-document">
              <div class="log-document__meta">
                <span class="badge badge--gold">PDF Log</span>
                <span class="badge">${escapeHTML(formatDate(entry.addedAt))}</span>
              </div>
              <h4 class="log-document__title">${escapeHTML(entry.heading)}</h4>
              ${entry.description ? `<p class="archive-copy">${escapeHTML(entry.description)}</p>` : ""}
              <div class="log-document__actions">
                ${entry.pdfUrl ? `<button class="button button--primary button--small" type="button" data-open-pdf='${escapeHTML(JSON.stringify({ name: entry.pdfName || entry.heading, url: entry.pdfUrl, creatureName }))}'>Read in Archive</button>` : ""}
                ${entry.pdfUrl ? `<a class="button button--ghost button--small" href="${escapeHTML(entry.pdfUrl)}" target="_blank" rel="noopener noreferrer">Open PDF</a>` : `<span class="badge">No PDF attached</span>`}
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function buildFieldReports() {
  const sightings = [];
  const logs = [];
  db.creatures.forEach((creature) => {
    creature.archiveFiles.forEach((file) => {
      if (file.kind === "sightings") {
        sightings.push({
          id: `${creature.id}-sightings`,
          title: creature.name,
          creatureSlug: creature.slug,
          pantheon: creaturePantheonName(creature),
          date: file.updatedAt,
          excerpt: file.content.split("\n\n")[0],
          content: file.content,
          kind: "sightings"
        });
      }
      if (file.kind === "logs") {
        logs.push({
          id: `${creature.id}-log`,
          title: creature.name,
          creatureSlug: creature.slug,
          pantheon: creaturePantheonName(creature),
          date: file.updatedAt,
          excerpt: file.content.split("\n\n")[0],
          content: file.content,
          kind: "logs"
        });
      }
    });
  });

  sightings.sort((a, b) => new Date(b.date) - new Date(a.date));
  logs.sort((a, b) => new Date(b.date) - new Date(a.date));

  return { sightings, logs };
}

function getRecentlyUpdatedItems() {
  const creatureItems = db.creatures
    .filter((item) => item.recentlyUpdated)
    .map((creature) => ({
      type: "creature",
      slug: creature.slug,
      date: creature.updatedAt,
      title: creature.name,
      subtitle: `${creaturePantheonName(creature)} • ${creature.status}`,
      excerpt: creature.summary,
      href: `./creature.html?id=${encodeURIComponent(creature.slug)}`
    }));

  const archiveItems = [];
  db.creatures.forEach((creature) => {
    creature.archiveFiles
      .filter((file) => file.kind === "logs" && file.recentlyUpdated)
      .forEach((file) => {
        archiveItems.push({
          type: "log",
          date: file.updatedAt,
          title: `${creature.name} Log`,
          subtitle: creaturePantheonName(creature),
          excerpt: file.content.slice(0, 150),
          href: `./creature.html?id=${encodeURIComponent(creature.slug)}#logs`
        });
      });
  });

  return [...creatureItems, ...archiveItems].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
}

function renderSymbol(symbolImageUrl, symbolText, className = "") {
  if (symbolImageUrl) {
    return `<img class="${className}" src="${escapeHTML(symbolImageUrl)}" alt="" />`;
  }
  return `<span class="${className}">${escapeHTML(symbolText || "◌")}</span>`;
}

function renderCreaturePreviewImage(creature) {
  const src = resolveCreatureImage(creature);
  const fallback = makeCreatureArt({ artKind: getCreatureArtKind(creature) });
  return `<img src="${escapeHTML(src)}" alt="${escapeHTML(creature.name)}" data-creature-image data-fallback-src="${escapeHTML(fallback)}" />`;
}

function renderCreatureImageFieldPreview(creature) {
  const src = resolveCreatureImage(creature);
  return `
    <div class="card-image-frame image-dropzone" style="max-width: 280px;" data-image-dropzone tabindex="0" role="button" aria-label="Upload creature image">
      <img src="${escapeHTML(src)}" alt="${escapeHTML(creature.name || "Creature preview")}" data-creature-image data-fallback-src="${escapeHTML(makeCreatureArt({ artKind: getCreatureArtKind(creature) }))}" />
      <div class="image-dropzone__hint">Drop image here or click to upload</div>
    </div>
  `;
}

function renderLogEntryEditor(entry) {
  return `
    <article class="pdf-log-editor" data-log-entry-id="${escapeHTML(entry.id)}">
      <div class="pdf-log-editor__fields">
        <label class="field">
          <span>Log Heading</span>
          <input type="text" value="${escapeHTML(entry.heading)}" data-log-heading="${escapeHTML(entry.id)}" placeholder="Midnight Forest Encounter" />
        </label>
        <label class="field">
          <span>Reader Note</span>
          <textarea data-log-description="${escapeHTML(entry.id)}" placeholder="Short setup or archive note for readers.">${escapeHTML(entry.description || "")}</textarea>
        </label>
      </div>
      <div class="pdf-log-editor__meta">
        <span class="badge badge--gold">${entry.pdfUrl ? "PDF Attached" : "No PDF Yet"}</span>
        <span class="badge">${escapeHTML(entry.pdfName || "Archive PDF")}</span>
      </div>
      <div class="pdf-log-editor__actions">
        <button class="button button--ghost button--small" type="button" data-attach-pdf="${escapeHTML(entry.id)}">${entry.pdfUrl ? "Replace PDF" : "Attach PDF"}</button>
        <button class="button button--danger button--small" type="button" data-delete-log-entry="${escapeHTML(entry.id)}">Delete Log</button>
      </div>
    </article>
  `;
}

function getActiveClass(path) {
  const current = location.pathname.split("/").pop() || "index.html";
  const normalized = current === "" ? "index.html" : current;
  return normalized === path ? "is-active" : "";
}

function renderHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  header.innerHTML = `
    <div class="topbar">
      <button class="brand brand--button" type="button" aria-label="Cryptopedia.com logo" data-logo-trigger>
        <span class="brand-mark">☾</span>
        <span class="brand-name">Cryptopedia.com</span>
      </button>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" data-nav-toggle>Menu</button>
      <nav id="main-nav" class="nav-links" aria-label="Primary">
        <a class="${getActiveClass("index.html")}" href="./index.html">Home</a>
        <a class="${getActiveClass("explore.html")}" href="./explore.html">Explore</a>
        <a class="${getActiveClass("field-reports.html")}" href="./field-reports.html?tab=reports">Field Reports</a>
        <a class="${getActiveClass("field-reports.html")}" href="./field-reports.html?tab=logs">Logs</a>
        <a class="${getActiveClass("about.html")}" href="./about.html">About</a>
      </nav>
    </div>
  `;
}

function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer">
      <div class="footer__grid">
        <section>
          <h3 class="footer__title">Cryptopedia.com</h3>
          <p class="footer__copy">
            A moonlit field archive for mythic creatures, sightings, and fictional research notes.
            The archive uses a dark academic visual language inspired by old foundations, folklore catalogues, and nocturnal field journals.
          </p>
        </section>
        <section>
          <h3 class="footer__title">Archive Routes</h3>
          <div class="footer__links">
            <a href="./explore.html">Explore the archive</a>
            <a href="./field-reports.html?tab=reports">View field reports</a>
            <a href="./field-reports.html?tab=logs">Read logs</a>
            <a href="./about.html">About the archive</a>
          </div>
        </section>
        <section>
          <h3 class="footer__title">Studio Access</h3>
          <p class="footer__copy">
            The Writer Studio is hidden behind the logo ritual and guarded by a password prompt.
            Data currently lives in localStorage and is structured for later Supabase migration.
          </p>
        </section>
      </div>
      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} Cryptopedia.com</span>
        <span>Field archive for myth, mystery, and moonlit research.</span>
      </div>
    </div>
  `;
}

function makeButton(label, href, className = "button--primary") {
  return `<a class="button ${className}" href="${href}">${label}</a>`;
}

function renderHomePage(root) {
  const recent = getRecentlyUpdatedItems();
  const pantheons = getPantheons();
  const types = getTypes();
  root.innerHTML = `
    <section class="hero">
      <div class="hero__card">
        <div class="hero__eyebrow">Documenting the Unknown</div>
        <h1 class="hero__title">
          <span>Enter the Archive</span>
          <span>of Myth and Mystery</span>
        </h1>
        <p class="hero__subtitle">
          Discover mythological creatures, ancient legends, recent sightings, and personal encounter logs from cultures around the world.
        </p>
        <form class="hero__search" id="hero-search-form">
          <label class="field">
            <span class="sr-only">Search the archive</span>
            <input id="hero-search-input" type="search" placeholder="Search creatures, pantheons, locations, or keywords..." />
          </label>
          <button class="button button--primary" type="submit">Explore the Archive</button>
        </form>
        <div class="card-meta" style="margin-top: 18px;">
          <span class="badge badge--gold">8 Featured Creatures</span>
          <span class="badge">10 Pantheons</span>
          <span class="badge">5 Creature Types</span>
          <span class="badge">Dark Archive Edition</span>
        </div>
      </div>
      <div class="hero-side">
        <article class="glass-panel hero-stat">
          <div class="hero-stat__label">Archive Status</div>
          <div class="hero-stat__value">Moonlit / Live</div>
          <div class="hero-stat__copy">The field archive is active. Recent sightings are being logged across the system.</div>
        </article>
        <article class="glass-panel hero-stat">
          <div class="hero-stat__label">Hidden Console</div>
          <div class="hero-stat__value">Writer Studio</div>
          <div class="hero-stat__copy">Accessible only through the logo ritual and password verification.</div>
        </article>
        <article class="glass-panel hero-stat">
          <div class="hero-stat__label">Recommended Reading</div>
          <div class="hero-stat__value">Field Logs</div>
          <div class="hero-stat__copy">First-person encounter stories from the site owner and archive curator.</div>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section__header">
        <div>
          <div class="section__eyebrow">Recently Updated</div>
          <h2 class="section__title">New entries moving through the archive</h2>
        </div>
        <div class="section__actions">
          <a class="button button--ghost" href="./field-reports.html?tab=reports">View all reports</a>
        </div>
      </div>
      <div class="grid grid--cards">
        ${recent.map(renderRecentItem).join("")}
      </div>
    </section>

    <section class="section">
      <div class="section__header">
        <div>
          <div class="section__eyebrow">Explore by Pantheon</div>
          <h2 class="section__title">Ten mythic lineages, one archive</h2>
        </div>
        <div class="section__actions">
          <a class="button button--ghost" href="./explore.html">Browse all pantheons</a>
        </div>
      </div>
      <div class="preview-grid">
        ${pantheons.map(renderPantheonCard).join("")}
      </div>
    </section>

    <section class="section">
      <div class="section__header">
        <div>
          <div class="section__eyebrow">Creature Categories</div>
          <h2 class="section__title">Threat, temperament, and anomaly profile</h2>
        </div>
        <div class="section__actions">
          <a class="button button--ghost" href="./explore.html">Filter creatures</a>
        </div>
      </div>
      <div class="preview-grid">
        ${types.map(renderTypeCardPreview).join("")}
      </div>
    </section>

    <section class="section">
      <div class="grid grid--3">
        <article class="quote-card">
          “We do not claim all these stories are true. We preserve them because they changed the people who told them.”
          <cite>— The Archivist</cite>
        </article>
        <article class="panel panel--soft">
          <div class="panel-heading">The Archive's Log</div>
          <p class="prose">New expedition records from the Himalayas have been added. An unusual winged silhouette was seen over the tree line at midnight.</p>
          <a class="button button--ghost button--small" href="./field-reports.html?tab=logs">Read the latest log</a>
        </article>
        <article class="panel panel--soft">
          <div class="panel-heading">Join the Archive</div>
          <p class="prose">Create an account later and connect to your own field notes, creature drafts, and administrative records.</p>
          <a class="button button--primary button--small" href="./studio.html">Open studio</a>
        </article>
      </div>
    </section>
  `;

  const searchForm = root.querySelector("#hero-search-form");
  const searchInput = root.querySelector("#hero-search-input");
  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput?.value?.trim() || "";
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    window.location.href = `./explore.html${params.toString() ? `?${params.toString()}` : ""}`;
  });
}

function renderRecentItem(item) {
  if (item.type === "creature") {
    const creature = getCreature(item.slug || item.title);
    if (!creature) return "";
    return `
      <article class="creature-card">
        <div class="creature-card__media">
          ${renderCreaturePreviewImage(creature).replace("<img ", '<img loading="lazy" decoding="async" ')}
        </div>
        <div class="creature-card__body">
          <div class="small-meta">
            <span class="badge badge--gold">${escapeHTML(creaturePantheonName(creature))}</span>
            <span class="badge">${escapeHTML(creature.status)}</span>
          </div>
          <h3 class="creature-card__title">${escapeHTML(creature.name)}</h3>
          <p class="creature-card__desc">${escapeHTML(creature.summary)}</p>
          <div class="creature-card__footer">
            <span class="badge">Updated ${escapeHTML(formatDate(creature.updatedAt))}</span>
            <a class="button button--primary button--small" href="./creature.html?id=${encodeURIComponent(creature.slug)}">Open File</a>
          </div>
        </div>
      </article>
    `;
  }

  return `
    <article class="report-card">
      <div class="report-card__body">
        <div class="report-card__eyebrow">Recent Log</div>
        <h3 class="report-card__title">${escapeHTML(item.title)}</h3>
        <p class="report-card__desc">${escapeHTML(item.excerpt)}</p>
        <div class="report-card__footer">
          <span>${escapeHTML(item.subtitle)}</span>
          <a class="button button--ghost button--small" href="${escapeHTML(item.href)}">Read</a>
        </div>
      </div>
    </article>
  `;
}

function renderPantheonCard(pantheon) {
  return `
    <a class="pantheon-card" href="./explore.html?pantheon=${encodeURIComponent(pantheon.id)}">
      <div class="pantheon-card__body">
        <div class="pantheon-card__symbol">${renderSymbol(pantheon.symbolImageUrl, pantheon.symbolText)}</div>
        <h3 class="pantheon-card__title">${escapeHTML(pantheon.name)}</h3>
        <p class="pantheon-card__desc">${escapeHTML(pantheon.description)}</p>
        <div class="small-meta">
          ${pantheon.famousCreatures.slice(0, 3).map((name) => `<span class="tag">${escapeHTML(name)}</span>`).join("")}
        </div>
      </div>
    </a>
  `;
}

function renderTypeCardPreview(type) {
  return `
    <a class="type-card" href="./explore.html?type=${encodeURIComponent(type.id)}">
      <div class="type-card__body">
        <div class="type-card__symbol">${renderSymbol(type.symbolImageUrl, type.symbolText)}</div>
        <h3 class="type-card__title">${escapeHTML(type.name)}</h3>
        <p class="type-card__desc">${escapeHTML(type.description)}</p>
      </div>
    </a>
  `;
}

function renderExplorePage(root) {
  const params = new URLSearchParams(location.search);
  const search = params.get("q") || "";
  const selectedPantheon = params.get("pantheon") || "all";
  const selectedType = params.get("type") || "all";
  const pantheons = getPantheons();
  const types = getTypes();

  const filtered = getCreatures().filter((creature) => {
    const pantheonMatch = selectedPantheon === "all" || creature.pantheonId === selectedPantheon;
    const typeMatch = selectedType === "all" || creature.typeIds.includes(selectedType);
    if (!pantheonMatch || !typeMatch) return false;
    if (!search) return true;
    const haystack = [
      creature.name,
      creature.aliases.join(" "),
      creature.region,
      creature.summary,
      creature.biologicalForm,
      creaturePantheonName(creature),
      creatureTags(creature).join(" ")
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  root.innerHTML = `
    <section class="section">
      <div class="section__header">
        <div>
          <div class="section__eyebrow">Explore</div>
          <h1 class="section__title">Step into the archive by pantheon and creature type</h1>
          <p class="section__desc">
            Choose a pantheon, then narrow the archive by creature type. Cards update instantly and can open any creature file.
          </p>
        </div>
      </div>
      <div class="stepper">
        <div class="stepper__bar">
          <div class="step-pill is-active"><span class="step-pill__num">1</span> Choose Pantheon</div>
          <div class="step-pill ${selectedPantheon !== "all" ? "is-active" : ""}"><span class="step-pill__num">2</span> Choose Type</div>
        </div>

        <div class="panel panel--soft">
          <div class="section__header" style="margin-bottom: 14px;">
            <div>
              <div class="section__eyebrow">Pantheons</div>
              <h2 class="section__title" style="font-size: 1.9rem;">Select a lineage</h2>
            </div>
            <div class="section__actions">
              <a class="button button--ghost button--small" href="./explore.html${search ? `?q=${encodeURIComponent(search)}` : ""}">Clear filters</a>
            </div>
          </div>
          <div class="preview-grid">
            ${renderAllCard(pantheons, "pantheon", selectedPantheon)}
          </div>
        </div>

        <div class="panel panel--soft">
          <div class="section__header" style="margin-bottom: 14px;">
            <div>
              <div class="section__eyebrow">Creature Types</div>
              <h2 class="section__title" style="font-size: 1.9rem;">Refine the search</h2>
            </div>
            <div class="section__actions">
              <span class="badge">Showing ${filtered.length} creatures</span>
            </div>
          </div>
          <div class="preview-grid">
            ${renderAllCard(types, "type", selectedType)}
          </div>
        </div>

        <div class="panel panel--soft">
          <div class="section__header" style="margin-bottom: 14px;">
            <div>
              <div class="section__eyebrow">Results</div>
              <h2 class="section__title" style="font-size: 1.9rem;">Matching creatures</h2>
            </div>
          </div>
          <div class="grid grid--cards">
            ${filtered.length ? filtered.map(renderCreatureCard).join("") : `<div class="empty-state">No creatures match the current filters.</div>`}
          </div>
        </div>
      </div>
    </section>
  `;

  root.querySelectorAll("[data-filter-link]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      const kind = el.dataset.kind;
      const id = el.dataset.id;
      const next = new URLSearchParams(location.search);
      if (kind === "pantheon") {
        next.set("pantheon", id);
      }
      if (kind === "type") {
        next.set("type", id);
      }
      window.location.href = `./explore.html?${next.toString()}`;
    });
  });
}

function renderAllCard(items, kind, activeId) {
  if (kind === "pantheon") {
    return items
      .map((item) => `
        <a href="./explore.html?pantheon=${encodeURIComponent(item.id)}${location.search.includes("q=") ? `&${location.search.slice(1)}` : ""}" class="pantheon-card ${activeId === item.id ? "is-active" : ""}" data-filter-link data-kind="pantheon" data-id="${escapeHTML(item.id)}">
          <div class="pantheon-card__body">
            <div class="pantheon-card__symbol">${renderSymbol(item.symbolImageUrl, item.symbolText)}</div>
            <h3 class="pantheon-card__title">${escapeHTML(item.name)}</h3>
            <p class="pantheon-card__desc">${escapeHTML(item.description)}</p>
            <div class="small-meta">${item.famousCreatures.slice(0, 3).map((name) => `<span class="tag">${escapeHTML(name)}</span>`).join("")}</div>
          </div>
        </a>
      `)
      .join("");
  }

  return items
    .map((item) => `
      <a href="./explore.html?type=${encodeURIComponent(item.id)}${location.search.includes("q=") ? `&${location.search.slice(1)}` : ""}" class="type-card ${activeId === item.id ? "is-active" : ""}" data-filter-link data-kind="type" data-id="${escapeHTML(item.id)}">
        <div class="type-card__body">
          <div class="type-card__symbol">${renderSymbol(item.symbolImageUrl, item.symbolText)}</div>
          <h3 class="type-card__title">${escapeHTML(item.name)}</h3>
          <p class="type-card__desc">${escapeHTML(item.description)}</p>
        </div>
      </a>
    `)
    .join("");
}

function renderCreatureCard(creature) {
  const pantheon = creaturePantheonName(creature);
  const threatClass =
    creature.threatLevel.toLowerCase() === "extreme" || creature.threatLevel.toLowerCase() === "high"
      ? "badge--danger"
      : creature.threatLevel.toLowerCase() === "low"
        ? "badge--success"
        : "badge--gold";
  return `
    <article class="creature-card">
      <a class="creature-card__media" href="./creature.html?id=${encodeURIComponent(creature.slug)}">
        ${renderCreaturePreviewImage(creature).replace("<img ", '<img loading="lazy" decoding="async" ')}
      </a>
      <div class="creature-card__body">
        <div class="small-meta">
          <span class="badge badge--gold">${escapeHTML(pantheon)}</span>
          <span class="badge ${threatClass}">Threat: ${escapeHTML(creature.threatLevel)}</span>
        </div>
        <h3 class="creature-card__title">${escapeHTML(creature.name)}</h3>
        <p class="creature-card__desc">${escapeHTML(creaturePreviewText(creature))}</p>
        <div class="small-meta">
          ${creatureTags(creature).map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`).join("")}
        </div>
        <div class="creature-card__footer">
          <span class="badge">Updated ${escapeHTML(formatDate(creature.updatedAt))}</span>
          <a class="button button--primary button--small" href="./creature.html?id=${encodeURIComponent(creature.slug)}">Open File</a>
        </div>
      </div>
    </article>
  `;
}

function renderCreaturePage(root) {
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || db.creatures[0]?.slug || "";
  const creature = getCreature(id) || db.creatures[0];
  const activeTab = params.get("tab") || "history";
  const files = creature.archiveFiles;
  const related = getCreatures()
    .filter((item) => item.slug !== creature.slug && item.pantheonId === creature.pantheonId)
    .slice(0, 3);

  root.innerHTML = `
    <section class="section">
      <div class="profile-layout">
        <article class="glass-panel profile-hero">
          ${renderCreaturePreviewImage(creature).replace("<img ", '<img class="profile-image" decoding="async" ')}
          <h1 class="profile-title">${escapeHTML(creature.name)}</h1>
          <div class="small-meta" style="margin-top: 10px;">
            ${creature.aliases.map((alias) => `<span class="badge">${escapeHTML(alias)}</span>`).join("")}
          </div>
          <p class="hero__subtitle" style="margin-top: 14px; max-width: none;">
            ${escapeHTML(creature.summary)}
          </p>
          <div class="profile-quickfacts">
            ${[
              ["Pantheon", creaturePantheonName(creature)],
              ["Region", creature.region],
              ["Biological / Physical Form", creature.biologicalForm],
              ["Creature Type Tags", creatureTags(creature).join(", ")],
              ["Threat Level", creature.threatLevel],
              ["Status", creature.status],
              ["Habitat", creature.habitat],
              ["Activity Time", creature.activityTime]
            ]
              .map(
                ([label, value]) => `
                  <div class="fact-row">
                    <div class="fact-row__label">${escapeHTML(label)}</div>
                    <div class="fact-row__value">${escapeHTML(value)}</div>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>

        <article class="panel panel--soft">
          <div class="section__header">
            <div>
              <div class="section__eyebrow">Archive Files</div>
              <h2 class="section__title" style="font-size: 2rem;">Three records, one creature file</h2>
            </div>
            <a class="button button--ghost button--small" href="./explore.html?pantheon=${encodeURIComponent(creature.pantheonId)}">More from this pantheon</a>
          </div>
          <div class="tabs">
            ${files
              .map(
                (file) => `
                  <button class="tab-button ${activeTab === file.kind ? "is-active" : ""}" type="button" data-tab="${escapeHTML(file.kind)}">${escapeHTML(file.title)}</button>
                `
              )
              .join("")}
          </div>
          <div class="tab-panel">
            ${files
              .map((file) => {
                const hidden = activeTab !== file.kind ? "display:none;" : "";
                const documentShelf = file.kind === "logs" ? renderLogEntries(file.entries || [], creature.name) : "";
                return `
                  <section class="archive-sheet" data-tab-panel="${escapeHTML(file.kind)}" style="${hidden}">
                    <div class="small-meta">
                      <span class="badge badge--gold">${escapeHTML(file.title)}</span>
                      <span class="badge">Updated ${escapeHTML(formatDateTime(file.updatedAt))}</span>
                    </div>
                    ${joinLines(file.content)}
                    ${documentShelf}
                  </section>
                `;
              })
              .join("")}
          </div>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section__header">
        <div>
          <div class="section__eyebrow">Related Files</div>
          <h2 class="section__title">More creatures from the same archive line</h2>
        </div>
      </div>
      <div class="grid grid--3">
        ${related.map(renderCreatureCard).join("")}
      </div>
    </section>
  `;

  root.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = new URLSearchParams(location.search);
      next.set("tab", btn.dataset.tab || "history");
      window.location.href = `./creature.html?${next.toString()}`;
    });
  });
}

function renderFieldReportsPage(root) {
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab") || "reports";
  const { sightings, logs } = buildFieldReports();
  const items = tab === "logs" ? logs : sightings;
  root.innerHTML = `
    <section class="section">
      <div class="section__header">
        <div>
          <div class="section__eyebrow">Field Reports / Logs</div>
          <h1 class="section__title">Recent testimony and archive logs</h1>
          <p class="section__desc">
            Field reports collect sightings and encounters. Logs collect first-person writing from the archive owner.
          </p>
        </div>
      </div>
      <div class="tabs">
        <button class="tab-button ${tab === "reports" ? "is-active" : ""}" type="button" data-reports-tab="reports">Field Reports</button>
        <button class="tab-button ${tab === "logs" ? "is-active" : ""}" type="button" data-reports-tab="logs">Logs</button>
      </div>
      <div class="section-divider"></div>
      <div class="grid grid--2">
        ${items
          .map(
            (item) => `
              <article class="report-card">
                <div class="report-card__body">
                  <div class="report-card__eyebrow">${escapeHTML(tab === "logs" ? "Owner Log" : "Field Report")}</div>
                  <h3 class="report-card__title">${escapeHTML(item.title)}</h3>
                  <p class="report-card__desc">${escapeHTML(item.excerpt)}</p>
                  <div class="report-card__footer">
                    <span>${escapeHTML(item.pantheon)}</span>
                    <span>${escapeHTML(formatDate(item.date))}</span>
                  </div>
                  <div class="report-card__footer">
                    <a class="button button--ghost button--small" href="./creature.html?id=${encodeURIComponent(item.creatureSlug)}">Open Creature</a>
                    <span class="badge">${escapeHTML(item.kind === "logs" ? "Log" : "Report")}</span>
                  </div>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;

  root.querySelectorAll("[data-reports-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = new URLSearchParams(location.search);
      next.set("tab", btn.dataset.reportsTab || "reports");
      window.location.href = `./field-reports.html?${next.toString()}`;
    });
  });
}

function renderAboutPage(root) {
  root.innerHTML = `
    <section class="section">
      <div class="section__header">
        <div>
          <div class="section__eyebrow">About</div>
          <h1 class="section__title">A dark archive for folklore, sightings, and mythic field notes</h1>
        </div>
      </div>
      <div class="grid grid--2">
        <article class="panel panel--soft">
          <div class="panel-heading">What this archive is</div>
          <p class="about-copy">
            Cryptopedia.com is designed like a premium nocturnal reference vault: part SCP-style archive, part mythology index, part field journal.
            The visual system combines moonlit forest imagery, parchment-toned notes, and silver-blue interface light.
          </p>
          <p class="about-copy">
            The archive is intentionally fictional and cinematic. It is built to feel serious, restrained, and atmospheric rather than playful fantasy.
          </p>
        </article>
        <article class="panel panel--parchment">
          <div class="panel-heading">Data structure</div>
          <p class="about-copy">
            Creatures, pantheons, and types are stored in localStorage for now. The code is shaped around a future Supabase migration with separate tables for
            creatures, archive files, pantheons, and cryptid types.
          </p>
          <p class="about-copy">
            Pantheon and type symbols can be uploaded as PNGs later and will display from <code>symbol_image_url</code> before the text fallback.
          </p>
        </article>
      </div>
      <div class="section-divider"></div>
      <div class="grid grid--3">
        <article class="quote-card">"The forest keeps old stories alive by refusing to explain them."</article>
        <article class="quote-card">"A file is never just a file here. It is a memory with dust on it."</article>
        <article class="quote-card">"The moon does not reveal the archive. It only makes the shadows honest."</article>
      </div>
    </section>
  `;
}

function renderStudioPage(root) {
  if (!sessionStorage.getItem(ADMIN_KEY)) {
    root.innerHTML = `
      <section class="section">
        <div class="panel panel--soft">
          <div class="section__eyebrow">Locked</div>
          <h1 class="section__title">Writer Studio access required</h1>
          <p class="about-copy">
            Click the Cryptopedia.com logo five times to reveal the password prompt. The archive console opens only after verification.
          </p>
          <button class="button button--primary" type="button" id="open-password-dialog">Reveal password prompt</button>
        </div>
      </section>
    `;
    root.querySelector("#open-password-dialog")?.addEventListener("click", openPasswordDialog);
    return;
  }

  const tab = appState.studioTab || "creatures";
  const counts = {
    creatures: db.creatures.length,
    pantheons: db.pantheons.length,
    types: db.types.length
  };

  root.innerHTML = `
    <section class="section">
      <div class="section__header">
        <div>
          <div class="section__eyebrow">Writer Studio</div>
          <h1 class="section__title">Secret archive console</h1>
          <p class="section__desc">Add, edit, reorder, and remove creatures, pantheons, and cryptid types. Data currently saves to localStorage.</p>
        </div>
      </div>
      <div class="studio-layout">
        <aside class="studio-sidebar">
          <div class="panel panel--soft">
            <div class="panel-heading">Overview</div>
            <div class="small-meta" style="margin-top: 12px;">
              <span class="badge">${counts.creatures} Creatures</span>
              <span class="badge">${counts.pantheons} Pantheons</span>
              <span class="badge">${counts.types} Types</span>
            </div>
          </div>
          <div class="panel panel--soft">
            <div class="panel-heading">Managers</div>
            <div class="studio-nav">
              <button class="${tab === "creatures" ? "is-active" : ""}" data-studio-tab="creatures">Creatures</button>
              <button class="${tab === "pantheons" ? "is-active" : ""}" data-studio-tab="pantheons">Pantheon Manager</button>
              <button class="${tab === "types" ? "is-active" : ""}" data-studio-tab="types">Cryptid Type Manager</button>
            </div>
          </div>
        </aside>
        <div class="studio-content">
          ${tab === "creatures" ? renderCreatureManager() : ""}
          ${tab === "pantheons" ? renderPantheonManager() : ""}
          ${tab === "types" ? renderTypeManager() : ""}
        </div>
      </div>
    </section>
  `;

  root.querySelectorAll("[data-studio-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      appState.studioTab = btn.dataset.studioTab || "creatures";
      renderPage();
    });
  });
}

function renderCreatureManager() {
  const creatures = getCreatures();
  return `
    <div class="panel panel--soft studio-section">
      <div class="studio-toolbar">
        <div>
          <div class="section__eyebrow">Creature Manager</div>
          <h2 class="section__title" style="font-size: 2rem;">Add or update creatures</h2>
        </div>
        <button class="button button--primary" type="button" data-create-creature>Create Creature</button>
      </div>
      <div class="list-grid">
        ${creatures
          .map(
            (creature) => `
              <div class="list-item">
                <div class="list-item__main">
                  <h3 class="list-item__title">${escapeHTML(creature.name)}</h3>
                  <p class="list-item__subtitle">${escapeHTML(creaturePantheonName(creature))} • ${escapeHTML(creature.status)} • ${escapeHTML(creature.threatLevel)}</p>
                  <div class="small-meta">
                    ${creature.typeIds.map((id) => `<span class="tag">${escapeHTML(getType(id)?.name || id)}</span>`).join("")}
                  </div>
                </div>
                <div class="list-actions">
                  <button class="button button--ghost button--small" type="button" data-edit-creature="${escapeHTML(creature.slug)}">Edit</button>
                  <a class="button button--ghost button--small" href="./creature.html?id=${encodeURIComponent(creature.slug)}">View</a>
                  <button class="button button--danger button--small" type="button" data-delete-creature="${escapeHTML(creature.slug)}">Delete</button>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderPantheonManager() {
  const pantheons = getPantheons();
  const attachedIds = new Set(db.creatures.map((creature) => creature.pantheonId));
  return `
    <div class="panel panel--soft studio-section">
      <div class="studio-toolbar">
        <div>
          <div class="section__eyebrow">Pantheon Manager</div>
          <h2 class="section__title" style="font-size: 2rem;">Manage pantheons and symbols</h2>
          <p class="help-text">PNG uploads are stored locally for now. When Supabase is added, these map to the <code>pantheon-symbols</code> bucket.</p>
        </div>
        <button class="button button--primary" type="button" data-create-pantheon>Add Pantheon</button>
      </div>
      <div class="list-grid">
        ${pantheons
          .map(
            (pantheon, index) => `
              <div class="list-item">
                <div class="list-item__main">
                  <h3 class="list-item__title">${escapeHTML(pantheon.name)}</h3>
                  <p class="list-item__subtitle">${escapeHTML(pantheon.description)}</p>
                  <div class="small-meta">
                    ${pantheon.famousCreatures.slice(0, 4).map((name) => `<span class="tag">${escapeHTML(name)}</span>`).join("")}
                  </div>
                </div>
                <div class="list-actions">
                  <div class="symbol-preview">${renderSymbol(pantheon.symbolImageUrl, pantheon.symbolText)}</div>
                  <button class="button button--ghost button--small" type="button" data-move-pantheon="${escapeHTML(pantheon.id)}" data-direction="up">↑</button>
                  <button class="button button--ghost button--small" type="button" data-move-pantheon="${escapeHTML(pantheon.id)}" data-direction="down">↓</button>
                  <button class="button button--ghost button--small" type="button" data-edit-pantheon="${escapeHTML(pantheon.id)}">Edit</button>
                  <button class="button button--danger button--small" type="button" data-delete-pantheon="${escapeHTML(pantheon.id)}" ${attachedIds.has(pantheon.id) ? "disabled" : ""}>Delete</button>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderTypeManager() {
  const types = getTypes();
  const usedIds = new Set(db.creatures.flatMap((creature) => creature.typeIds));
  return `
    <div class="panel panel--soft studio-section">
      <div class="studio-toolbar">
        <div>
          <div class="section__eyebrow">Cryptid Type Manager</div>
          <h2 class="section__title" style="font-size: 2rem;">Manage type symbols and descriptions</h2>
          <p class="help-text">PNG uploads are stored locally for now. When Supabase is added, these map to the <code>type-symbols</code> bucket.</p>
        </div>
        <button class="button button--primary" type="button" data-create-type>Add Type</button>
      </div>
      <div class="list-grid">
        ${types
          .map(
            (type) => `
              <div class="list-item">
                <div class="list-item__main">
                  <h3 class="list-item__title">${escapeHTML(type.name)}</h3>
                  <p class="list-item__subtitle">${escapeHTML(type.description)}</p>
                </div>
                <div class="list-actions">
                  <div class="symbol-preview">${renderSymbol(type.symbolImageUrl, type.symbolText)}</div>
                  <button class="button button--ghost button--small" type="button" data-move-type="${escapeHTML(type.id)}" data-direction="up">↑</button>
                  <button class="button button--ghost button--small" type="button" data-move-type="${escapeHTML(type.id)}" data-direction="down">↓</button>
                  <button class="button button--ghost button--small" type="button" data-edit-type="${escapeHTML(type.id)}">Edit</button>
                  <button class="button button--danger button--small" type="button" data-delete-type="${escapeHTML(type.id)}" ${usedIds.has(type.id) ? "disabled" : ""}>Delete</button>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function openPasswordDialog() {
  const dialog = document.getElementById("password-dialog");
  const input = document.getElementById("password-input");
  const error = document.getElementById("password-error");
  if (!dialog) return;
  error.textContent = "";
  dialog.showModal();
  setTimeout(() => input?.focus(), 50);
}

function openModal(title, content) {
  const root = document.getElementById("modal-root");
  if (!root) return;
  root.innerHTML = `
    <dialog class="modal">
      <form method="dialog" class="modal-card" id="modal-card">
        <h2 class="modal-heading">${escapeHTML(title)}</h2>
        <div class="modal-body">${content}</div>
        <div class="modal-actions">
          <button type="button" class="button button--ghost" data-modal-cancel>Close</button>
          <button type="submit" class="button button--primary" data-modal-submit>Save</button>
        </div>
      </form>
    </dialog>
  `;
  const dialog = root.querySelector("dialog");
  if (dialog?.showModal) {
    dialog.showModal();
  } else if (dialog) {
    dialog.setAttribute("open", "");
  }
  const close = () => {
    root.innerHTML = "";
  };
  root.querySelector("[data-modal-cancel]")?.addEventListener("click", close);
  root.querySelector("dialog")?.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) close();
  });
  return { root, close };
}

function creatureFormMarkup(creature = null) {
  const current = creature || {
    name: "",
    aliases: [""],
    artKind: DEFAULT_ART_KIND,
    pantheonId: db.pantheons[0]?.id || "",
    region: "",
    biologicalForm: "",
    typeIds: [],
    threatLevel: "Moderate",
    status: "Active",
    habitat: "",
    activityTime: "",
    summary: "",
    imageUrl: "",
    recentlyUpdated: false,
    archiveFiles: [
      { kind: "history", title: "History & Cultural Significance", content: "" },
      { kind: "sightings", title: "Recent Sightings & Hiker Accounts", content: "" },
      { kind: "logs", title: "Logs", content: "" }
    ]
  };
  const files = Object.fromEntries(current.archiveFiles.map((file) => [file.kind, file.content || ""]));
  const logEntries = normalizeLogEntries(getArchiveFile(current, "logs")?.entries || []);
  return `
    <div class="mini-grid">
      <label class="field"><span>Name</span><input name="name" value="${escapeHTML(current.name)}" required /></label>
      <label class="field"><span>Aliases</span><input name="aliases" value="${escapeHTML((current.aliases || []).join(", "))}" placeholder="Comma-separated aliases" /></label>
      <label class="field"><span>Pantheon</span><select name="pantheonId">${getPantheons().map((p) => `<option value="${escapeHTML(p.id)}" ${p.id === current.pantheonId ? "selected" : ""}>${escapeHTML(p.name)}</option>`).join("")}</select></label>
      <label class="field"><span>Region</span><input name="region" value="${escapeHTML(current.region)}" /></label>
      <label class="field"><span>Biological / Physical Form</span><input name="biologicalForm" value="${escapeHTML(current.biologicalForm)}" /></label>
      <label class="field"><span>Threat Level</span>
        <select name="threatLevel">
          ${["Low", "Moderate", "High", "Extreme", "Unknown"].map((value) => `<option value="${value}" ${value === current.threatLevel ? "selected" : ""}>${value}</option>`).join("")}
        </select>
      </label>
      <label class="field"><span>Status</span><input name="status" value="${escapeHTML(current.status)}" /></label>
      <label class="field"><span>Habitat</span><input name="habitat" value="${escapeHTML(current.habitat)}" /></label>
      <label class="field"><span>Activity Time</span><input name="activityTime" value="${escapeHTML(current.activityTime)}" /></label>
      <label class="field"><span>Fallback Archive Art</span><select name="artKind">${Object.entries(CREATURE_ART_BY_SLUG).map(([key, value]) => value).filter((value, index, arr) => arr.indexOf(value) === index).map((value) => `<option value="${escapeHTML(value)}" ${value === (current.artKind || DEFAULT_ART_KIND) ? "selected" : ""}>${escapeHTML(value)}</option>`).join("")}</select></label>
      <label class="field" style="grid-column: 1 / -1;"><span>Creature Type Tags</span><div class="toggle-row">${getTypes().map((type) => `<label class="pill"><input type="checkbox" name="typeIds" value="${escapeHTML(type.id)}" ${current.typeIds?.includes(type.id) ? "checked" : ""} /> ${escapeHTML(type.name)}</label>`).join("")}</div></label>
      <label class="field" style="grid-column: 1 / -1;"><span>Short Summary</span><textarea name="summary">${escapeHTML(current.summary)}</textarea></label>
      <label class="field" style="grid-column: 1 / -1;"><span>Image URL / data URL</span><input name="imageUrl" value="${escapeHTML(current.imageUrl)}" /></label>
      <label class="field"><span>Upload Creature Image</span><input name="imageFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif" /></label>
      <div class="note-box">
        If an external image URL fails or blocks hotlinking, upload the image here instead. JPG, PNG, WEBP, and GIF are supported.
      </div>
      <div style="grid-column: 1 / -1;">
        ${renderCreatureImageFieldPreview(current)}
      </div>
      <label class="field"><span>Recently Updated</span><select name="recentlyUpdated"><option value="yes" ${current.recentlyUpdated ? "selected" : ""}>Yes</option><option value="no" ${!current.recentlyUpdated ? "selected" : ""}>No</option></select></label>
      <label class="field"><span>Last Updated</span><input name="updatedAt" value="${escapeHTML(current.updatedAt || new Date().toISOString())}" /></label>
      <label class="field" style="grid-column: 1 / -1;"><span>History & Cultural Significance</span><textarea name="history">${escapeHTML(files.history || "")}</textarea></label>
      <label class="field" style="grid-column: 1 / -1;"><span>Recent Sightings & Hiker Accounts</span><textarea name="sightings">${escapeHTML(files.sightings || "")}</textarea></label>
      <label class="field" style="grid-column: 1 / -1;"><span>Logs Introduction</span><textarea name="logs">${escapeHTML(files.logs || "")}</textarea></label>
      <div class="field" style="grid-column: 1 / -1;">
        <span>Reader Log Archive</span>
        <input name="logPdfFiles" type="file" accept="application/pdf" hidden />
        <div class="pdf-dropzone" data-pdf-dropzone tabindex="0" role="button" aria-label="Add PDF logs">
          <div class="pdf-dropzone__plus">+</div>
          <div class="pdf-dropzone__copy">Drag and drop PDF files here, or click to create a new log entry with a PDF</div>
        </div>
        <div class="studio-toolbar" style="margin-top: 10px;">
          <div class="help-text">Each log entry can have its own heading, note, and attached PDF.</div>
          <button class="button button--ghost button--small" type="button" data-add-log-entry>Add Log Heading</button>
        </div>
        <div class="pdf-upload-list" data-pdf-upload-list>
          ${logEntries.map(renderLogEntryEditor).join("")}
        </div>
      </div>
    </div>
  `;
}

function pantheonFormMarkup(pantheon = null) {
  const current = pantheon || {
    name: "",
    description: "",
    famousCreatures: [""],
    symbolText: "",
    symbolImageUrl: "",
    sortOrder: getPantheons().length + 1
  };
  return `
    <div class="mini-grid">
      <label class="field"><span>Name</span><input name="name" value="${escapeHTML(current.name)}" required /></label>
      <label class="field"><span>Famous Creatures</span><input name="famousCreatures" value="${escapeHTML((current.famousCreatures || []).join(", "))}" /></label>
      <label class="field" style="grid-column: 1 / -1;"><span>Description</span><textarea name="description">${escapeHTML(current.description)}</textarea></label>
      <label class="field"><span>Text Symbol</span><input name="symbolText" value="${escapeHTML(current.symbolText || "")}" placeholder="Emoji or text fallback" /></label>
      <label class="field"><span>PNG Symbol Upload</span><input name="symbolFile" type="file" accept="image/png" /></label>
      <div class="note-box" style="grid-column: 1 / -1;">
        Recommended transparent PNG, 512x512 or 1024x1024. Preview appears before save.
      </div>
      <div class="symbol-preview" style="grid-column: 1 / -1;">
        ${renderSymbol(current.symbolImageUrl, current.symbolText)}
      </div>
    </div>
  `;
}

function typeFormMarkup(type = null) {
  const current = type || {
    name: "",
    description: "",
    symbolText: "",
    symbolImageUrl: "",
    sortOrder: getTypes().length + 1
  };
  return `
    <div class="mini-grid">
      <label class="field"><span>Name</span><input name="name" value="${escapeHTML(current.name)}" required /></label>
      <label class="field"><span>Text Symbol</span><input name="symbolText" value="${escapeHTML(current.symbolText || "")}" placeholder="Emoji or text fallback" /></label>
      <label class="field"><span>PNG Symbol Upload</span><input name="symbolFile" type="file" accept="image/png" /></label>
      <label class="field" style="grid-column: 1 / -1;"><span>Description</span><textarea name="description">${escapeHTML(current.description)}</textarea></label>
      <div class="note-box" style="grid-column: 1 / -1;">
        Recommended transparent PNG, 512x512 or 1024x1024. Preview appears before save.
      </div>
      <div class="symbol-preview" style="grid-column: 1 / -1;">
        ${renderSymbol(current.symbolImageUrl, current.symbolText)}
      </div>
    </div>
  `;
}

async function fileToDataUrl(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function attachCreatureImageFallbacks(scope = document) {
  scope.querySelectorAll("[data-creature-image]").forEach((img) => {
    if (img.dataset.fallbackBound === "yes") return;
    img.dataset.fallbackBound = "yes";
    img.addEventListener("error", () => {
      const fallback = img.dataset.fallbackSrc;
      if (!fallback || img.dataset.fallbackApplied === "yes") return;
      img.dataset.fallbackApplied = "yes";
      img.src = fallback;
    });
  });
}

function openPdfReader(payload) {
  closePdfReader();
  const overlay = document.createElement("div");
  overlay.className = "pdf-reader-overlay open";
  overlay.innerHTML = `
    <div class="pdf-reader-topbar">
      <div class="pdf-reader-title">${escapeHTML(payload.creatureName || "Archive")} • ${escapeHTML(payload.name || "PDF Log")}</div>
      <div class="pdf-reader-actions">
        <a class="button button--ghost button--small" href="${escapeHTML(payload.url)}" target="_blank" rel="noopener noreferrer">Open in New Tab</a>
        <button class="button button--primary button--small" type="button" data-close-pdf-reader>Close</button>
      </div>
    </div>
    <div class="pdf-reader-stage">
      <iframe class="pdf-reader-frame" src="${escapeHTML(payload.url)}#view=FitH" title="${escapeHTML(payload.name || "PDF Log")}"></iframe>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.classList.add("no-scroll");
  overlay.querySelector("[data-close-pdf-reader]")?.addEventListener("click", closePdfReader);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closePdfReader();
  });
}

function closePdfReader() {
  document.querySelector(".pdf-reader-overlay")?.remove();
  document.body.classList.remove("no-scroll");
}

function attachPdfReaderActions(scope = document) {
  scope.querySelectorAll("[data-open-pdf]").forEach((button) => {
    if (button.dataset.pdfBound === "yes") return;
    button.dataset.pdfBound = "yes";
    button.addEventListener("click", () => {
      const payload = JSON.parse(button.dataset.openPdf || "{}");
      if (payload.url) openPdfReader(payload);
    });
  });
}

function showToast(message, tone = "success") {
  const root = document.getElementById("toast-root");
  if (!root) return;
  const node = document.createElement("div");
  node.className = `toast toast--${tone}`;
  node.textContent = message;
  root.appendChild(node);
  setTimeout(() => {
    node.style.opacity = "0";
    node.style.transform = "translateY(6px)";
  }, 2400);
  setTimeout(() => {
    node.remove();
  }, 3000);
}

function persistAndRerender(message = "Saved.") {
  saveDB(db);
  showToast(message, "success");
  renderPage();
}

function upsertCreature(existing = null) {
  const modal = openModal(existing ? "Edit Creature" : "Create Creature", creatureFormMarkup(existing));
  const form = modal.root.querySelector("form");
  const imageUrlInput = form?.querySelector('input[name="imageUrl"]');
  const imageFileInput = form?.querySelector('input[name="imageFile"]');
  const logPdfInput = form?.querySelector('input[name="logPdfFiles"]');
  const previewImage = form?.querySelector("[data-creature-image]");
  const imageDropzone = form?.querySelector("[data-image-dropzone]");
  const pdfDropzone = form?.querySelector("[data-pdf-dropzone]");
  const pdfUploadList = form?.querySelector("[data-pdf-upload-list]");
  const addLogEntryButton = form?.querySelector("[data-add-log-entry]");
  const previewFallback = previewImage?.dataset.fallbackSrc || "";
  let logEntries = normalizeLogEntries(getArchiveFile(existing || { archiveFiles: [] }, "logs")?.entries || []);
  let pendingPdfEntryId = "";

  function updatePreview(src) {
    if (!previewImage) return;
    previewImage.src = src || previewFallback;
    previewImage.dataset.fallbackApplied = "no";
  }

  function createBlankLogEntry() {
    return {
      id: uid("log"),
      heading: "Untitled Log",
      description: "",
      pdfName: "Archive PDF",
      pdfUrl: "",
      addedAt: new Date().toISOString()
    };
  }

  function syncLogEntryInputs() {
    if (!pdfUploadList) return;
    pdfUploadList.querySelectorAll("[data-log-heading]").forEach((input) => {
      input.addEventListener("input", () => {
        const entry = logEntries.find((item) => item.id === input.dataset.logHeading);
        if (entry) entry.heading = input.value.trim() || "Untitled Log";
      });
    });
    pdfUploadList.querySelectorAll("[data-log-description]").forEach((input) => {
      input.addEventListener("input", () => {
        const entry = logEntries.find((item) => item.id === input.dataset.logDescription);
        if (entry) entry.description = input.value;
      });
    });
    pdfUploadList.querySelectorAll("[data-delete-log-entry]").forEach((button) => {
      button.addEventListener("click", () => {
        logEntries = logEntries.filter((entry) => entry.id !== button.dataset.deleteLogEntry);
        renderLogDocumentList();
      });
    });
    pdfUploadList.querySelectorAll("[data-attach-pdf]").forEach((button) => {
      button.addEventListener("click", () => {
        pendingPdfEntryId = button.dataset.attachPdf || "";
        logPdfInput?.click();
      });
    });
  }

  function renderLogDocumentList() {
    if (!pdfUploadList) return;
    pdfUploadList.innerHTML = logEntries.length ? logEntries.map(renderLogEntryEditor).join("") : `<div class="help-text">No log entries yet. Add one to start the archive shelf.</div>`;
    syncLogEntryInputs();
  }

  async function addPdfFiles(fileList) {
    const files = Array.from(fileList || []);
    for (const file of files) {
      const validType = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
      if (!validType) {
        showToast(`Skipped ${file.name}: only PDF files are allowed.`, "warning");
        continue;
      }
      const dataUrl = await fileToDataUrl(file);
      const targetId = pendingPdfEntryId || uid("log");
      let entry = logEntries.find((item) => item.id === targetId);
      if (!entry) {
        entry = createBlankLogEntry();
        entry.id = targetId;
        entry.heading = file.name.replace(/\.pdf$/i, "") || "Untitled Log";
        logEntries.push(entry);
      }
      entry.pdfName = file.name;
      entry.pdfUrl = dataUrl;
      entry.addedAt = new Date().toISOString();
      if (!entry.heading || entry.heading === "Untitled Log") {
        entry.heading = file.name.replace(/\.pdf$/i, "") || "Untitled Log";
      }
      pendingPdfEntryId = "";
    }
    renderLogDocumentList();
  }

  imageUrlInput?.addEventListener("input", () => {
    if (imageFileInput?.dataset.uploaded) return;
    updatePreview(String(imageUrlInput.value || "").trim());
  });

  imageFileInput?.addEventListener("change", async () => {
    const file = imageFileInput.files?.[0];
    if (!file) {
      delete imageFileInput.dataset.uploaded;
      updatePreview(String(imageUrlInput?.value || "").trim());
      return;
    }
    if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) {
      showToast("Creature uploads must be PNG, JPG, WEBP, or GIF.", "warning");
      imageFileInput.value = "";
      delete imageFileInput.dataset.uploaded;
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    imageFileInput.dataset.uploaded = dataUrl;
    updatePreview(dataUrl);
  });

  imageDropzone?.addEventListener("click", () => imageFileInput?.click());
  imageDropzone?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      imageFileInput?.click();
    }
  });
  imageDropzone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    imageDropzone.classList.add("is-dragging");
  });
  imageDropzone?.addEventListener("dragleave", () => {
    imageDropzone.classList.remove("is-dragging");
  });
  imageDropzone?.addEventListener("drop", async (event) => {
    event.preventDefault();
    imageDropzone.classList.remove("is-dragging");
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) {
      showToast("Drop a PNG, JPG, WEBP, or GIF image.", "warning");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    imageFileInput.dataset.uploaded = dataUrl;
    updatePreview(dataUrl);
  });

  pdfDropzone?.addEventListener("click", () => logPdfInput?.click());
  pdfDropzone?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      logPdfInput?.click();
    }
  });
  pdfDropzone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    pdfDropzone.classList.add("is-dragging");
  });
  pdfDropzone?.addEventListener("dragleave", () => {
    pdfDropzone.classList.remove("is-dragging");
  });
  pdfDropzone?.addEventListener("drop", async (event) => {
    event.preventDefault();
    pdfDropzone.classList.remove("is-dragging");
    pendingPdfEntryId = "";
    await addPdfFiles(event.dataTransfer?.files || []);
  });
  logPdfInput?.addEventListener("change", async () => {
    await addPdfFiles(logPdfInput.files || []);
    logPdfInput.value = "";
    pendingPdfEntryId = "";
  });
  addLogEntryButton?.addEventListener("click", () => {
    logEntries.push(createBlankLogEntry());
    renderLogDocumentList();
  });

  attachCreatureImageFallbacks(form);
  renderLogDocumentList();
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fd = new FormData(form);
    const typeIds = fd.getAll("typeIds").map(String);
    const aliases = String(fd.get("aliases") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const imageUrl = imageFileInput?.dataset.uploaded || String(fd.get("imageUrl") || "").trim();
    const currentId = existing?.id || uid("creature");
    const archiveFiles = [
      { kind: "history", title: "History & Cultural Significance", content: String(fd.get("history") || ""), updatedAt: String(fd.get("updatedAt") || new Date().toISOString()) },
      { kind: "sightings", title: "Recent Sightings & Hiker Accounts", content: String(fd.get("sightings") || ""), updatedAt: String(fd.get("updatedAt") || new Date().toISOString()) },
      { kind: "logs", title: "Logs", content: String(fd.get("logs") || ""), updatedAt: String(fd.get("updatedAt") || new Date().toISOString()), recentlyUpdated: String(fd.get("recentlyUpdated")) === "yes", entries: logEntries }
    ];
    const creature = {
      id: currentId,
      slug: existing?.slug || slugify(String(fd.get("name") || "")) || currentId,
      name: String(fd.get("name") || "").trim(),
      aliases,
      artKind: String(fd.get("artKind") || existing?.artKind || CREATURE_ART_BY_SLUG[existing?.slug] || DEFAULT_ART_KIND),
      pantheonId: String(fd.get("pantheonId") || ""),
      region: String(fd.get("region") || ""),
      biologicalForm: String(fd.get("biologicalForm") || ""),
      typeIds,
      threatLevel: String(fd.get("threatLevel") || "Moderate"),
      status: String(fd.get("status") || ""),
      habitat: String(fd.get("habitat") || ""),
      activityTime: String(fd.get("activityTime") || ""),
      summary: String(fd.get("summary") || ""),
      imageUrl,
      recentlyUpdated: String(fd.get("recentlyUpdated")) === "yes",
      updatedAt: String(fd.get("updatedAt") || new Date().toISOString()),
      archiveFiles
    };
    const index = db.creatures.findIndex((item) => item.id === currentId);
    if (index >= 0) db.creatures[index] = creature;
    else db.creatures.unshift(creature);
    modal.close();
    persistAndRerender(existing ? "Creature updated." : "Creature created.");
  });
}

function upsertPantheon(existing = null) {
  const modal = openModal(existing ? "Edit Pantheon" : "Add Pantheon", pantheonFormMarkup(existing));
  const form = modal.root.querySelector("form");
  const fileInput = form?.querySelector('input[name="symbolFile"]');
  const preview = form?.querySelector(".symbol-preview");
  fileInput?.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (file.type !== "image/png") {
      showToast("Pantheon symbols must be PNG files.", "warning");
      fileInput.value = "";
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    preview.innerHTML = `<img src="${escapeHTML(dataUrl)}" alt="" />`;
    fileInput.dataset.uploaded = dataUrl;
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = new FormData(form);
    const currentId = existing?.id || slugify(String(fd.get("name") || "")) || uid("pantheon");
    const uploaded = fileInput?.dataset.uploaded || existing?.symbolImageUrl || "";
    const pantheon = {
      id: currentId,
      name: String(fd.get("name") || "").trim(),
      description: String(fd.get("description") || ""),
      famousCreatures: String(fd.get("famousCreatures") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      symbolText: String(fd.get("symbolText") || ""),
      symbolImageUrl: uploaded,
      sortOrder: existing?.sortOrder || getPantheons().length + 1
    };
    const index = db.pantheons.findIndex((item) => item.id === currentId);
    if (index >= 0) db.pantheons[index] = pantheon;
    else db.pantheons.push(pantheon);
    modal.close();
    persistAndRerender(existing ? "Pantheon updated." : "Pantheon added.");
  });
}

function upsertType(existing = null) {
  const modal = openModal(existing ? "Edit Cryptid Type" : "Add Cryptid Type", typeFormMarkup(existing));
  const form = modal.root.querySelector("form");
  const fileInput = form?.querySelector('input[name="symbolFile"]');
  const preview = form?.querySelector(".symbol-preview");
  fileInput?.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (file.type !== "image/png") {
      showToast("Type symbols must be PNG files.", "warning");
      fileInput.value = "";
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    preview.innerHTML = `<img src="${escapeHTML(dataUrl)}" alt="" />`;
    fileInput.dataset.uploaded = dataUrl;
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = new FormData(form);
    const currentId = existing?.id || slugify(String(fd.get("name") || "")) || uid("type");
    const uploaded = fileInput?.dataset.uploaded || existing?.symbolImageUrl || "";
    const type = {
      id: currentId,
      name: String(fd.get("name") || "").trim(),
      description: String(fd.get("description") || ""),
      symbolText: String(fd.get("symbolText") || ""),
      symbolImageUrl: uploaded,
      sortOrder: existing?.sortOrder || getTypes().length + 1
    };
    const index = db.types.findIndex((item) => item.id === currentId);
    if (index >= 0) db.types[index] = type;
    else db.types.push(type);
    modal.close();
    persistAndRerender(existing ? "Type updated." : "Type added.");
  });
}

function moveItem(list, id, direction) {
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) return list;
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= list.length) return list;
  [list[index], list[target]] = [list[target], list[index]];
  list.forEach((item, order) => {
    item.sortOrder = order + 1;
  });
  return list;
}

function confirmAndDeleteCreature(slug) {
  const creature = getCreature(slug);
  if (!creature) return;
  if (!confirm(`Delete ${creature.name}? This will remove its archive files too.`)) return;
  db.creatures = db.creatures.filter((item) => item.slug !== slug && item.id !== creature.id);
  persistAndRerender("Creature deleted.");
}

function confirmAndDeletePantheon(id) {
  if (db.creatures.some((creature) => creature.pantheonId === id)) {
    showToast("Delete blocked: at least one creature is attached to this pantheon.", "warning");
    return;
  }
  const pantheon = getPantheon(id);
  if (!pantheon) return;
  if (!confirm(`Delete pantheon "${pantheon.name}"?`)) return;
  db.pantheons = db.pantheons.filter((item) => item.id !== id);
  persistAndRerender("Pantheon deleted.");
}

function confirmAndDeleteType(id) {
  if (db.creatures.some((creature) => creature.typeIds.includes(id))) {
    showToast("Delete blocked: this type is still attached to at least one creature.", "warning");
    return;
  }
  const type = getType(id);
  if (!type) return;
  if (!confirm(`Delete type "${type.name}"?`)) return;
  db.types = db.types.filter((item) => item.id !== id);
  persistAndRerender("Type deleted.");
}

function attachSharedActions(root) {
  root.querySelector("[data-create-creature]")?.addEventListener("click", () => upsertCreature());
  root.querySelector("[data-create-pantheon]")?.addEventListener("click", () => upsertPantheon());
  root.querySelector("[data-create-type]")?.addEventListener("click", () => upsertType());

  root.querySelectorAll("[data-edit-creature]").forEach((btn) => {
    btn.addEventListener("click", () => upsertCreature(getCreature(btn.dataset.editCreature)));
  });
  root.querySelectorAll("[data-delete-creature]").forEach((btn) => {
    btn.addEventListener("click", () => confirmAndDeleteCreature(btn.dataset.deleteCreature));
  });
  root.querySelectorAll("[data-edit-pantheon]").forEach((btn) => {
    btn.addEventListener("click", () => upsertPantheon(getPantheon(btn.dataset.editPantheon)));
  });
  root.querySelectorAll("[data-delete-pantheon]").forEach((btn) => {
    btn.addEventListener("click", () => confirmAndDeletePantheon(btn.dataset.deletePantheon));
  });
  root.querySelectorAll("[data-edit-type]").forEach((btn) => {
    btn.addEventListener("click", () => upsertType(getType(btn.dataset.editType)));
  });
  root.querySelectorAll("[data-delete-type]").forEach((btn) => {
    btn.addEventListener("click", () => confirmAndDeleteType(btn.dataset.deleteType));
  });
  root.querySelectorAll("[data-move-pantheon]").forEach((btn) => {
    btn.addEventListener("click", () => {
      db.pantheons = moveItem([...getPantheons()], btn.dataset.movePantheon, btn.dataset.direction).map((item, index) => ({ ...item, sortOrder: index + 1 }));
      persistAndRerender("Pantheons reordered.");
    });
  });
  root.querySelectorAll("[data-move-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      db.types = moveItem([...getTypes()], btn.dataset.moveType, btn.dataset.direction).map((item, index) => ({ ...item, sortOrder: index + 1 }));
      persistAndRerender("Types reordered.");
    });
  });
}

function renderPage() {
  db = loadDB();
  renderHeader();
  renderFooter();
  setupHeaderInteractivity();
  const root = document.getElementById("app");
  if (!root) return;
  root.innerHTML = "";

  switch (page) {
    case "home":
      renderHomePage(root);
      break;
    case "explore":
      renderExplorePage(root);
      break;
    case "creature":
      renderCreaturePage(root);
      break;
    case "field-reports":
      renderFieldReportsPage(root);
      break;
    case "studio":
      renderStudioPage(root);
      break;
    case "about":
      renderAboutPage(root);
      break;
    default:
      renderHomePage(root);
  }

  attachCreatureImageFallbacks(root);
  attachPdfReaderActions(root);
  attachSharedActions(root);
}

function setupHeaderInteractivity() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const brand = document.querySelector("[data-logo-trigger]");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  let clickCount = 0;
  let clickTimer = null;
  brand?.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    clickCount += 1;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      clickCount = 0;
    }, 1200);
    if (clickCount >= 5) {
      event.preventDefault();
      clickCount = 0;
      openPasswordDialog();
    }
  });
}

function setupPasswordDialog() {
  const dialog = document.getElementById("password-dialog");
  const form = document.getElementById("password-form");
  const input = document.getElementById("password-input");
  const error = document.getElementById("password-error");
  document.querySelectorAll("[data-dialog-close]").forEach((btn) => {
    btn.addEventListener("click", () => dialog?.close());
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = String(input?.value || "");
    if (value !== ADMIN_PASSWORD) {
      error.textContent = "Incorrect password.";
      input?.focus();
      input?.select();
      return;
    }
    sessionStorage.setItem(ADMIN_KEY, "true");
    error.textContent = "";
    dialog?.close();
    showToast("Writer Studio unlocked.", "success");
    if (page !== "studio") {
      setTimeout(() => {
        window.location.href = "./studio.html";
      }, 400);
    } else {
      renderPage();
    }
  });
}

function buildMoonlitBackground() {
  const bg = document.getElementById("moonlit-background");
  if (!bg) return;
  bg.innerHTML = `
    ${makeMoonlitBackgroundArt()}
    <div class="moonlit-mist"></div>
    <div class="moonlit-mist moonlit-mist--secondary"></div>
  `;
}

function spawnEyes() {
  const layer = document.getElementById("eye-layer");
  if (!layer) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowPower = window.innerWidth < 768;
  if (reduced) {
    layer.innerHTML = "";
    return;
  }

  const maxEyes = lowPower ? 3 : 5;
  const colors = ["white", "ice", "amber", "ember"];
  const shapes = ["round", "slit", "spider", "humanoid", "predator"];
  const patterns = ["single", "pair", "cluster"];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnOne() {
    if (document.hidden) return;
    if (layer.childElementCount >= maxEyes) {
      return;
    }
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = pattern === "single" ? 1 : pattern === "pair" ? 2 : Math.floor(random(3, 7));
    const cluster = document.createElement("div");
    cluster.className = `eye-sighting eye-color--${color}`;
    cluster.style.left = `${random(2, 96)}%`;
    cluster.style.top = `${random(28, 84)}%`;
    cluster.style.setProperty("--duration", `${random(11, 18).toFixed(1)}s`);
    cluster.style.transform = `translate3d(${random(-24, 24)}px, ${random(-10, 10)}px, 0) scale(${random(0.72, 1.18).toFixed(2)})`;
    cluster.style.zIndex = "1";

    for (let i = 0; i < count; i += 1) {
      const eye = document.createElement("span");
      eye.className = `eye-dot eye-dot--${shape}`;
      eye.style.setProperty("--eye-width", `${shape === "spider" ? random(5, 8) : shape === "predator" ? random(14, 18) : random(8, 14)}px`);
      eye.style.setProperty("--eye-height", `${shape === "slit" ? random(14, 20) : shape === "predator" ? random(11, 15) : random(7, 13)}px`);
      eye.style.setProperty("--flicker-duration", `${random(4.6, 8.2).toFixed(1)}s`);
      eye.style.animationDelay = `${random(0, 1.4).toFixed(2)}s`;

      if (pattern === "pair") {
        eye.style.margin = `0 ${i === 0 ? 5 : 0}px`;
        eye.style.transform = `translateY(${random(-1, 1)}px)`;
      }

      if (pattern === "cluster") {
        eye.style.margin = `${random(-4, 4)}px ${random(-4, 4)}px`;
      }

      cluster.appendChild(eye);
    }

    layer.appendChild(cluster);
    setTimeout(() => cluster.remove(), 18000);
  }

  spawnOne();
  const interval = setInterval(() => {
    spawnOne();
    if (layer.childElementCount > maxEyes) {
      while (layer.childElementCount > maxEyes) {
        layer.firstElementChild?.remove();
      }
    }
  }, lowPower ? 5200 : 4200);

  window.addEventListener("pagehide", () => clearInterval(interval), { once: true });
}

const appState = {
  studioTab: "creatures"
};

function init() {
  buildMoonlitBackground();
  setupPasswordDialog();
  renderPage();
  idle(() => spawnEyes(), 1800);
  const root = document.getElementById("modal-root");
  if (root) {
    root.addEventListener("click", (event) => {
      if (event.target === root) root.innerHTML = "";
    });
  }
}

window.addEventListener("DOMContentLoaded", init);
