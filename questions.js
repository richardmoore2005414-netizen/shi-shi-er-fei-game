const QUESTIONS = [
  {
    id: "CH021",
    category: "食物常識",
    statement: "微波爐加熱食物會產生致癌輻射。",
    isTrue: false,
    advanced: {
      prompt: "微波爐加熱食物實際上的物理原理是什麼？",
      options: {
        A: "利用放射性射線直接破壞微生物",
        B: "令食物中的水分子高頻震動摩擦生熱",
        C: "釋放紅外線加熱食物表面",
        D: "透過高壓電弧瞬間傳遞熱能"
      },
      correct: "B"
    },
    explanation: "微波屬於非游離輻射，能量遠低於 X 光等游離輻射，無法打斷分子鍵或誘發基因突變，其原理僅是帶動極性水分子震動摩擦產生熱量。",
    funFact: "微波爐的發明靈感來自於工程師在測試雷達磁控管時，發現口袋裡的朱古力融化了。"
  },
  {
    id: "CH022",
    category: "動物",
    statement: "袋熊排出的糞便呈現正立方體形狀。",
    isTrue: true,
    explanation: "袋熊的腸道最後一段具備不同的彈性收縮區，能將糞便塑造成平整的立方體，避免糞便在斜坡或石頭上滾落，用以標示領地。",
    funFact: "袋熊是自然界中目前已知唯一能自然排出正立方體糞便的動物。"
  },
  {
    id: "CH023",
    category: "人體健康",
    statement: "人體的脈搏只會朝一個方向跳動。",
    isTrue: false,
    advanced: {
      prompt: "人體心臟實際上會怎樣跳動？",
      options: {
        A: "只會左右擺動",
        B: "會在多個軸向上扭轉與扭曲",
        C: "只會前後跳動",
        D: "心臟本身不移動，只有血液流動"
      },
      correct: "B"
    },
    explanation: "心臟收縮時會同時產生扭轉與扭曲動作，不是簡單的一維跳動。這些複雜運動幮助血液更有效地被推送。",
    funFact: "心臟一天約跳 10 萬次，一生中可轉過 25 億次以上。"
  },
  {
    id: "CH024",
    category: "動物",
    statement: "鴨子的叫聲不會產生回音。",
    isTrue: true,
    explanation: "鴨子發聲時氣囊會對空氣產生特殊的不對稱加載，使聲波很難產生回音，這是一種自然的「消音」效果。",
    funFact: "科學家仍在研究如何將鴨子叫聲的特性應用於造船或建築的降噪設計。"
  },
  {
    id: "CH025",
    category: "食物常識",
    statement: "吃下的口香糖會在胃中留存七年。",
    isTrue: false,
    advanced: {
      prompt: "口香糖進入人體後實際會怎樣？",
      options: {
        A: "會被胃酸完全溶解並排出",
        B: "會在胃壁形成薄膜並留存數年",
        C: "會被小腸吸收並經甲狀腺代謝",
        D: "會直接進入血液並隊尿液排出"
      },
      correct: "A"
    },
    explanation: "口香糖的主要成分是糖與口香劑，進入胃部後會被胃酸和消化酶分解，不會留存。這個迷思可能源自早期對塑膠材料的誤解。",
    funFact: "現代口香糖多數使用可食用膠基，能被人體安全消化。"
  },
  {
    id: "CH026",
    category: "太空天文",
    statement: "太陽主要是由氮氣燃燒所構成。",
    isTrue: false,
    advanced: {
      prompt: "太陽的主要成分是什麼？",
      options: {
        A: "氮氣與氫氣",
        B: "氫氣與氦氣",
        C: "碳與氮氣",
        D: "鐵與鏽"
      },
      correct: "B"
    },
    explanation: "太陽約 73%是氫氣、27%是氦氣，其餘為較重元素。能量來自氫核融合反應，而非燃燒。",
    funFact: "太陽每秒鐘把約 6 億噸的氫轉化為氦，產生巨大能量。"
  },
  {
    id: "CH027",
    category: "人體健康",
    statement: "人體的骨骽約每十年更新一次。",
    isTrue: true,
    explanation: "骨骽是活的組織，不斷進行重塑與更新。成人骨骽完全更新一次大約需要 7–10 年。",
    funFact: "骨骽密度最高峰值出現在 20–30 歲，之後開始緩慢下降。"
  },
  {
    id: "CH028",
    category: "歷史與日常",
    statement: "金字塔是古埃及最高的建築物。",
    isTrue: false,
    advanced: {
      prompt: "古埃及目前仍存的最高古建築是什麼？",
      options: {
        A: "卡納克神廟",
        B: "阿布米比斯大神廟",
        C: "卡納克大金字塔",
        D: "阿斯旺神廟"
      },
      correct: "B"
    },
    explanation: "阿布米比斯大神廟（卡納克）高約 147 米，是古埃及仍存的最高古建築，也是世界最高的古建築之一。",
    funFact: "金字塔作為世界最高建築的紀錄維持了約 3800 年。"
  },
  {
    id: "CH029",
    category: "動物",
    statement: "蜜蜂是唯一會製造食用蜜的昆蟲。",
    isTrue: false,
    advanced: {
      prompt: "除了蜜蜂，還有哪些昆蟲會生產蜜？",
      options: {
        A: "只有蜜蜂能製蜜",
        B: "無刺蜂與黃蜂也能製蜜",
        C: "螞蛛與螞蛛能製蜜",
        D: "蟻蟻與蝸牛能製蜜"
      },
      correct: "B"
    },
    explanation: "除了蜜蜂，無刺蜂（stingless bees）以及某些黃蜂也會製造蜜。無刺蜂的蜜在熰帶地區很常見。",
    funFact: "無刺蜂的蜜水分較高，味道更酸，且不易保存。"
  },
  {
    id: "CH030",
    category: "人體健康",
    statement: "人體的指紋在一生中不會改變。",
    isTrue: false,
    advanced: {
      prompt: "指紋在什麼情況下可能改變？",
      options: {
        A: "指紋永不改變",
        B: "嚴重傷口、某些病症或老化可能影響指紋",
        C: "只會在孩童期改變",
        D: "只會因遺傳突變而改變"
      },
      correct: "B"
    },
    explanation: "雖然指紋具高度獨特性，但嚴重傷口、某些皮膚病、老化或手部勞動均可能使指紋模式改變或模糊。",
    funFact: "同卵雙胞胎的指紋不相同，證明環境也影響指紋形成。"
  },
  {
    id: "CH031",
    category: "太空天文",
    statement: "火星上有太陽系最高的山脈。",
    isTrue: true,
    explanation: "奧林帕斯山（Olympus Mons）高約 22 公里，是太陽系已知最高的山脈，比地球珠穆朗瑪峰高几乎三倍。",
    funFact: "奧林帕斯山的底部直徑約 600 公里，幾乎與法國面積相當。"
  },
  {
    id: "CH032",
    category: "食物常識",
    statement: "胡蘿蔔是蔬菜而非水果。",
    isTrue: false,
    advanced: {
      prompt: "從植物學角度來看，胡蘿蔔屬於什麼？",
      options: {
        A: "蔬菜（菜葉）",
        B: "果實（花打後的子房）",
        C: "根茎",
        D: "種子"
      },
      correct: "B"
    },
    explanation: "胡蘿蔔是花打後形成的子房，植物學上屬於果實。為什麼大家覺得是蔬菜？因為它通常用於咸味料理。",
    funFact: "作為果實，胡蘿蔔在美國曾被法庭裁定為蔬菜，以便徵收關稅（有名的 Nix v. Hedden 案）。"
  }
];