import React, { useState, useEffect } from 'react';
import { ComposedChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, ReferenceArea, Bar, ReferenceLine } from 'recharts';
const DEFAULT_CONFIG = {
  settings: {
    morning_offset: 9,
    name: "My Health Stack"
  },
  schedule: {
    morning: {
      label: "Morning",
      time: 0,
      note: "Fasted ~14-17h - peak autophagy window",
      oral: [
        { id: "egcg", name: "EGCG", dose: "300mg", benefits: "Autophagy amplifier via AMPK. ⚠️ Away from iron. Best when autophagy already active.", pathways: ["autophagy↑", "AMPK↑"], organ_load: { liver: 0.4, kidney: 0.1 } },
        { id: "pterostilbene", name: "Pterostilbene", dose: "100mg", benefits: "Sirtuin activation, crosses BBB. Synergizes with fasted state.", pathways: ["autophagy↑", "NAD+↑"], organ_load: { liver: 0.2, kidney: 0.05 } },
        { id: "spermidine", name: "Spermidine", dose: "1mg", benefits: "Autophagy inducer via AMPK + EP300 inhibition. MUST be fasted - amplifies already-active autophagy machinery.", pathways: ["autophagy↑↑"], organ_load: { liver: 0.05, kidney: 0.02 } },
        { id: "nr", name: "Nicotinamide Riboside", dose: "250mg", benefits: "NAD+ precursor. Morning = energizing + synergy with fasted state.", pathways: ["NAD+↑↑"], organ_load: { liver: 0.1, kidney: 0.1 } },
        { id: "tyrosine", name: "L-Tyrosine", dose: "500mg", benefits: "Dopamine precursor. Supports morning cortisol peak → alertness.", pathways: ["dopamine↑", "cortisol support"], organ_load: { liver: 0.15, kidney: 0.1 } },
        { id: "msm", name: "MSM", dose: "3g", benefits: "Sulfur for collagen/keratin.", pathways: ["collagen↑"], organ_load: { liver: 0.05, kidney: 0.15 } },
        { id: "ghkcu", name: "GHK-Cu", dose: "200mg", benefits: "Copper tripeptide. Collagen, wound healing, hair.", pathways: ["collagen↑", "repair↑"], organ_load: { liver: 0.1, kidney: 0.05 } }
      ],
      uti: [
        { id: "hiprex_am", name: "Hiprex", dose: "1g", benefits: "Urinary antiseptic.", organ_load: { liver: 0.05, kidney: 0.3 } },
        { id: "dmannose_am", name: "D-mannose", dose: "1g", benefits: "UTI prevention.", organ_load: { liver: 0, kidney: 0.2 } }
      ],
      skin_topical: [
        { name: "Cleanser", product: "Rovectin BHA/AHA/PHA" },
        { name: "Vitamin C", product: "Cos de Baha 15%", note: "Antioxidant, collagen" },
        { name: "SPF", product: "CeraVe 30 Mineral" }
      ],
      scalp_topical: [
        { name: "Minoxidil", product: "5%", note: "Apply to dry scalp" },
        { name: "Red Light", product: "10-15 min 630-660nm", note: "Cells saturate - once daily. 24h reset." }
      ],
      circadian: "Morning light + Tyrosine = strong 'wake' signal. Cortisol naturally peaks."
    },
    midday: {
      label: "Exercise + Lunch",
      time: 3,
      note: "Breaking 17h fast - mTOR pulse",
      oral: [
        { id: "protein_meal", name: "Protein Meal", dose: "~500kcal",
          benefits: "Breaks fast → mTOR activation → muscle protein synthesis. Autophagy crashes (intended).",
          pathways: ["mTOR↑↑", "autophagy↓↓", "insulin↑"],
          macros: { calories: "500", protein: "35g", carbs: "35g", fat: "14g", collagen: "10g" },
          organ_load: { liver: 0.2, kidney: 0.35 },
          components: [
            { name: "Kefir base", detail: "probiotics, protein, fat" },
            { name: "Vital Proteins Collagen", detail: "10g type I & III" },
            { name: "Nu3 Collagen Fit Shake", detail: "22g protein, 5g collagen" },
            { name: "Leucine", detail: "3g - ensures MPS threshold" },
            { name: "Creatine monohydrate", detail: "5g" },
            { name: "Nu3 Beauty Essentials", detail: "Vit C 160mg, Glycine 3g, Q10 50mg" },
            { name: "Orthosilicic acid", detail: "10mg Si - collagen cross-linking" },
            { name: "Seeds & grains", detail: "Linseed, Hemp, Cacao, Coconut, Oats, Sunflower" }
          ]
        },
        { id: "joint", name: "Joint Complex", dose: "Gluc 1.1g, Chond 1.2g, MSM 300mg", benefits: "Cartilage building blocks. Better absorption with food.", organ_load: { liver: 0.05, kidney: 0.1 } }
      ],
      with_food: [
        { id: "zinc", name: "Zinc Balance", dose: "15mg Zn + 1mg Cu", benefits: "⚠️ Nausea if fasted.", organ_load: { liver: 0.05, kidney: 0.05 } },
        { id: "vitamin_e", name: "Vitamin E", dose: "180mg", benefits: "Fat-soluble.", organ_load: { liver: 0.15, kidney: 0.02 } },
        { id: "vitamin_dk", name: "D3/K2", dose: "25mcg/200mcg", benefits: "Fat-soluble. D3 supports circadian rhythm, K2 routes calcium.", organ_load: { liver: 0.05, kidney: 0.02 } },
        { id: "fish_oil", name: "Fish Oil", dose: "800mg EPA, 400mg DHA", benefits: "Fat-soluble omega-3s.", organ_load: { liver: 0.1, kidney: 0.02 } },
        { id: "lutein", name: "Lutein", dose: "20mg + zeaxanthin", benefits: "Fat-soluble carotenoid.", organ_load: { liver: 0.05, kidney: 0.02 } }
      ],
      circadian: "D3 with first meal helps anchor circadian 'day' signal."
    },
    afternoon: {
      label: "Afternoon",
      time: 5,
      note: "Distributed liver load",
      oral: [
        { id: "quercetin", name: "Quercetin", dose: "500mg", benefits: "Senolytic. Moved from AM to distribute liver load.", pathways: ["autophagy support", "mTOR↓"], organ_load: { liver: 0.35, kidney: 0.1 } },
        { id: "rhodiola", name: "Rhodiola", dose: "500mg", benefits: "Adaptogen. Supports healthy cortisol curve.", pathways: ["cortisol mod."], organ_load: { liver: 0.3, kidney: 0.05 } },
        { id: "cognition", name: "Neuro Optimizer", dose: "Various",
          benefits: "Cholinergic support.",
          pathways: ["acetylcholine↑"],
          organ_load: { liver: 0.2, kidney: 0.15 },
          components: [
            { name: "Acetyl-L-carnitine", detail: "500mg" },
            { name: "L-glutamine", detail: "500mg" },
            { name: "Taurine", detail: "500mg - liver supportive" },
            { name: "CDP-choline", detail: "300mg" },
            { name: "Phosphatidylserine", detail: "100mg - cortisol mod" }
          ]
        },
        { id: "vitality", name: "Vitality Stack", dose: "Various",
          benefits: "Circulation, urinary support.",
          pathways: ["nitric oxide↑"],
          organ_load: { liver: 0.15, kidney: 0.2 },
          components: [
            { name: "Dandelion", detail: "500mg - liver supportive" },
            { name: "Maca", detail: "500mg - adaptogen" },
            { name: "Kidney complex", detail: "900mg" },
            { name: "L-citrulline", detail: "750mg - NO" }
          ]
        }
      ],
      separate: [
        { id: "marshmallow", name: "Marshmallow root", dose: "960mg", benefits: "⚠️ Take 1h away from other supps.", organ_load: { liver: 0.05, kidney: -0.1 } }
      ]
    },
    late_afternoon: {
      label: "Late Afternoon",
      time: 7,
      note: "Healthy fats + fiber",
      oral: [
        { id: "salad", name: "Power Salad", dose: "~450kcal",
          benefits: "Sustains energy. Fiber slows glucose response.",
          pathways: ["insulin↗", "satiety↑"],
          macros: { calories: "450", protein: "18g", carbs: "35g", fat: "28g", fiber: "12g" },
          organ_load: { liver: 0.1, kidney: 0.15 },
          components: [
            { name: "Mixed greens", detail: "100g spinach, arugula, kale" },
            { name: "Quinoa/farro", detail: "80g cooked" },
            { name: "Chickpeas", detail: "60g" },
            { name: "Avocado", detail: "½ medium" },
            { name: "Seeds", detail: "20g pumpkin + sunflower" },
            { name: "Olive oil dressing", detail: "15ml EVOO + balsamic" },
            { name: "Feta/goat cheese", detail: "30g" }
          ]
        }
      ],
      circadian: "Cortisol naturally declining. Avoid intense stress."
    },
    dinner: {
      label: "Dinner",
      time: 10,
      note: "Last meal - 5h before bed",
      oral: [
        { id: "dinner_meal", name: "Dinner", dose: "~700kcal",
          benefits: "Complete meal. 5h before bed allows digestion. GH release needs fasting during sleep.",
          pathways: ["mTOR↑", "insulin↑"],
          macros: { calories: "700", protein: "40g", carbs: "60g", fat: "25g", fiber: "10g" },
          organ_load: { liver: 0.25, kidney: 0.3 },
          components: [
            { name: "Protein source", detail: "150g chicken/fish/beef" },
            { name: "Complex carbs", detail: "150g rice/potato/quinoa" },
            { name: "Vegetables", detail: "200g mixed" },
            { name: "Healthy fats", detail: "Olive oil, avocado" }
          ]
        },
        { id: "tocotrienols", name: "Tocotrienols", dose: "200mg", benefits: "Unique vitamin E. ⚠️ 7h after tocopherols.", organ_load: { liver: 0.15, kidney: 0.02 } }
      ],
      circadian: "Tryptophan (protein) → serotonin → melatonin precursor."
    },
    wind_down: {
      label: "Wind-Down",
      time: 14,
      note: "23:00 - Circadian sleep prep",
      oral: [
        { id: "glycine", name: "Glycine", dose: "3g", benefits: "LOWERS CORE BODY TEMP - proven sleep mechanism. Also collagen precursor.", pathways: ["GABA↑", "temp↓", "collagen↑"], organ_load: { liver: 0.05, kidney: 0.1 } },
        { id: "inositol", name: "Inositol", dose: "6g", benefits: "Anxiety reduction, insulin sensitivity.", pathways: ["GABA↑", "insulin sens.↑"], organ_load: { liver: 0.05, kidney: 0.15 } },
        { id: "magnesium", name: "Triple Magnesium", dose: "210mg", benefits: "GABA modulation. Needed for melatonin synthesis.", pathways: ["GABA↑", "melatonin support"], organ_load: { liver: 0.02, kidney: 0.1 } },
        { id: "l_theanine", name: "L-Theanine", dose: "200mg", benefits: "Alpha waves, calm without sedation.", pathways: ["GABA↑", "alpha↑"], organ_load: { liver: 0.05, kidney: 0.05 } },
        { id: "ashwagandha", name: "Ashwagandha", dose: "450mg", benefits: "Cortisol reduction for sleep.", pathways: ["cortisol↓"], organ_load: { liver: 0.18, kidney: 0.05 } },
        { id: "taurine", name: "Taurine", dose: "500mg", benefits: "GABA-ergic, liver-protective.", pathways: ["GABA↑", "liver support"], organ_load: { liver: -0.1, kidney: 0.05 } }
      ],
      skin_topical: [
        { name: "Cleanser", product: "Rovectin" },
        { name: "Essence", product: "Bio Redox A 92.5%" },
        { name: "Retinoid", product: "Ordinary Granactive 5%" },
        { name: "PDRN", product: "Medicube peptides" },
        { name: "Night Mask", product: "Medicube Collagen" }
      ],
      scalp_topical: [
        { name: "Minoxidil", product: "5%" },
        { name: "Revivogen", product: "Shampoo", note: "DHT-blocking" }
      ],
      circadian: "Dim lights. Glycine drops core temp. Cortisol LOW. Melatonin rising."
    },
    bedtime: {
      label: "Bedtime",
      time: 15,
      note: "Midnight - Sleep onset",
      oral: [
        { id: "hiprex_pm", name: "Hiprex", dose: "1g", benefits: "Overnight antiseptic.", organ_load: { liver: 0.05, kidney: 0.3 } },
        { id: "dmannose_pm", name: "D-mannose", dose: "1g", benefits: "UTI prevention overnight.", organ_load: { liver: 0, kidney: 0.2 } }
      ],
      notes: "Fasting begins → autophagy builds overnight. GH peaks during deep sleep."
    }
  },
  future: [
    { item: "Low-dose Melatonin 0.3mg", rationale: "Circadian signaling at wind-down" },
    { item: "Apigenin 50mg", rationale: "Chamomile extract, GABAergic, sleep onset" }
  ]
};
// Calculate organ load per hour
const calculateOrganLoad = (schedule, morningOffset) => {
  const hourlyLoad = {};
  for (let h = 0; h <= 24; h++) {
    hourlyLoad[h] = { liver: 0, kidney: 0 };
  }
  
  Object.values(schedule).forEach(period => {
    if (!period) return;
    const hour = (morningOffset + (period.time || 0)) % 24;
    
    const allSupps = [
      ...(period.oral || []),
      ...(period.with_food || []),
      ...(period.uti || []),
      ...(period.separate || [])
    ];
    
    allSupps.forEach(supp => {
      if (supp.organ_load) {
        for (let offset = 0; offset < 3; offset++) {
          const targetHour = (hour + offset) % 24;
          const factor = offset === 0 ? 0.5 : offset === 1 ? 0.35 : 0.15;
          hourlyLoad[targetHour].liver += (supp.organ_load.liver || 0) * factor;
          hourlyLoad[targetHour].kidney += (supp.organ_load.kidney || 0) * factor;
        }
      }
    });
  });
  
  return hourlyLoad;
};
// OPTIMIZED stack timeline
const generateOptimizedData = (schedule, morningOffset) => {
  const organLoad = calculateOrganLoad(schedule, morningOffset);
  
  const keyPoints = {
    0: { mtor: 0.12, autophagy: 0.28, insulin: 0.15, gaba: 0.88, nad: 0.50, cortisol: 0.15, coreTemp: 0.35, label: "Sleep (5h fasted)" },
    1: { mtor: 0.10, autophagy: 0.32, insulin: 0.12, gaba: 0.85, nad: 0.52, cortisol: 0.12, coreTemp: 0.32, label: "Sleep (6h fasted)" },
    2: { mtor: 0.10, autophagy: 0.36, insulin: 0.10, gaba: 0.82, nad: 0.54, cortisol: 0.10, coreTemp: 0.30, label: "Deep Sleep (7h)" },
    3: { mtor: 0.10, autophagy: 0.40, insulin: 0.10, gaba: 0.80, nad: 0.55, cortisol: 0.12, coreTemp: 0.28, label: "Deep Sleep (8h)" },
    4: { mtor: 0.10, autophagy: 0.45, insulin: 0.10, gaba: 0.78, nad: 0.56, cortisol: 0.18, coreTemp: 0.30, label: "Sleep (9h fasted)" },
    5: { mtor: 0.10, autophagy: 0.50, insulin: 0.10, gaba: 0.72, nad: 0.58, cortisol: 0.28, coreTemp: 0.35, label: "Sleep (10h)" },
    6: { mtor: 0.10, autophagy: 0.55, insulin: 0.10, gaba: 0.65, nad: 0.60, cortisol: 0.45, coreTemp: 0.42, label: "Waking (11h)" },
    7: { mtor: 0.10, autophagy: 0.60, insulin: 0.10, gaba: 0.50, nad: 0.65, cortisol: 0.65, coreTemp: 0.50, label: "Waking (12h)" },
    8: { mtor: 0.10, autophagy: 0.68, insulin: 0.08, gaba: 0.35, nad: 0.75, cortisol: 0.80, coreTemp: 0.58, label: "Pre-morning (13h)" },
    9: { mtor: 0.08, autophagy: 0.75, insulin: 0.08, gaba: 0.25, nad: 0.88, cortisol: 0.85, coreTemp: 0.62, label: "Morning FASTED (14h)" },
    10: { mtor: 0.08, autophagy: 0.82, insulin: 0.06, gaba: 0.22, nad: 0.85, cortisol: 0.78, coreTemp: 0.65, label: "Late morning (15h)" },
    11: { mtor: 0.10, autophagy: 0.88, insulin: 0.08, gaba: 0.25, nad: 0.82, cortisol: 0.70, coreTemp: 0.68, label: "Pre-exercise (16h) PEAK" },
    12: { mtor: 0.55, autophagy: 0.35, insulin: 0.45, gaba: 0.28, nad: 0.68, cortisol: 0.60, coreTemp: 0.72, label: "Exercise + Lunch" },
    13: { mtor: 0.92, autophagy: 0.08, insulin: 0.72, gaba: 0.30, nad: 0.52, cortisol: 0.55, coreTemp: 0.75, label: "Post-meal PEAK mTOR" },
    14: { mtor: 0.55, autophagy: 0.12, insulin: 0.45, gaba: 0.32, nad: 0.54, cortisol: 0.48, coreTemp: 0.72, label: "Afternoon" },
    15: { mtor: 0.40, autophagy: 0.18, insulin: 0.32, gaba: 0.35, nad: 0.55, cortisol: 0.42, coreTemp: 0.70, label: "Mid-afternoon" },
    16: { mtor: 0.45, autophagy: 0.15, insulin: 0.38, gaba: 0.38, nad: 0.54, cortisol: 0.38, coreTemp: 0.68, label: "Salad" },
    17: { mtor: 0.35, autophagy: 0.18, insulin: 0.30, gaba: 0.42, nad: 0.52, cortisol: 0.32, coreTemp: 0.65, label: "Late afternoon" },
    18: { mtor: 0.28, autophagy: 0.22, insulin: 0.25, gaba: 0.48, nad: 0.50, cortisol: 0.28, coreTemp: 0.62, label: "Early evening" },
    19: { mtor: 0.58, autophagy: 0.10, insulin: 0.75, gaba: 0.52, nad: 0.45, cortisol: 0.25, coreTemp: 0.60, label: "Dinner" },
    20: { mtor: 0.42, autophagy: 0.12, insulin: 0.52, gaba: 0.58, nad: 0.46, cortisol: 0.22, coreTemp: 0.55, label: "Post-dinner" },
    21: { mtor: 0.30, autophagy: 0.18, insulin: 0.35, gaba: 0.65, nad: 0.47, cortisol: 0.20, coreTemp: 0.50, label: "Evening (2h post)" },
    22: { mtor: 0.22, autophagy: 0.22, insulin: 0.25, gaba: 0.75, nad: 0.48, cortisol: 0.18, coreTemp: 0.45, label: "Pre wind-down" },
    23: { mtor: 0.15, autophagy: 0.25, insulin: 0.18, gaba: 0.88, nad: 0.49, cortisol: 0.15, coreTemp: 0.38, label: "Wind-down" },
    24: { mtor: 0.12, autophagy: 0.28, insulin: 0.15, gaba: 0.90, nad: 0.50, cortisol: 0.12, coreTemp: 0.35, label: "Bedtime" }
  };
  
  return Object.entries(keyPoints).map(([h, data]) => {
    const load = organLoad[parseInt(h) % 24] || { liver: 0, kidney: 0 };
    return {
      hour: parseInt(h),
      clockTime: `${(parseInt(h) % 24).toString().padStart(2, '0')}:00`,
      ...data,
      liver: Math.min(load.liver, 1),
      kidney: Math.min(load.kidney, 1)
    };
  });
};
// WESTERN diet timeline
const generateWesternData = () => {
  const keyPoints = {
    0: { mtor: 0.25, autophagy: 0.18, insulin: 0.22, gaba: 0.65, nad: 0.42, cortisol: 0.15, coreTemp: 0.42, liver: 0.05, kidney: 0.05, label: "Sleep (2h since snack)" },
    1: { mtor: 0.20, autophagy: 0.22, insulin: 0.18, gaba: 0.68, nad: 0.44, cortisol: 0.12, coreTemp: 0.40, liver: 0.03, kidney: 0.03, label: "Sleep" },
    2: { mtor: 0.18, autophagy: 0.25, insulin: 0.15, gaba: 0.70, nad: 0.45, cortisol: 0.10, coreTemp: 0.38, liver: 0.02, kidney: 0.02, label: "Sleep" },
    3: { mtor: 0.15, autophagy: 0.28, insulin: 0.12, gaba: 0.72, nad: 0.46, cortisol: 0.12, coreTemp: 0.36, liver: 0.02, kidney: 0.02, label: "Sleep" },
    4: { mtor: 0.15, autophagy: 0.30, insulin: 0.12, gaba: 0.70, nad: 0.47, cortisol: 0.18, coreTemp: 0.38, liver: 0.02, kidney: 0.02, label: "Sleep" },
    5: { mtor: 0.15, autophagy: 0.32, insulin: 0.12, gaba: 0.65, nad: 0.48, cortisol: 0.28, coreTemp: 0.42, liver: 0.02, kidney: 0.02, label: "Waking" },
    6: { mtor: 0.18, autophagy: 0.35, insulin: 0.15, gaba: 0.55, nad: 0.50, cortisol: 0.50, coreTemp: 0.48, liver: 0.03, kidney: 0.03, label: "Waking" },
    7: { mtor: 0.65, autophagy: 0.12, insulin: 0.68, gaba: 0.40, nad: 0.45, cortisol: 0.75, coreTemp: 0.58, liver: 0.15, kidney: 0.20, label: "BREAKFAST" },
    8: { mtor: 0.55, autophagy: 0.10, insulin: 0.55, gaba: 0.35, nad: 0.42, cortisol: 0.80, coreTemp: 0.62, liver: 0.12, kidney: 0.15, label: "Post-breakfast" },
    9: { mtor: 0.42, autophagy: 0.12, insulin: 0.40, gaba: 0.32, nad: 0.44, cortisol: 0.75, coreTemp: 0.65, liver: 0.08, kidney: 0.10, label: "Mid-morning" },
    10: { mtor: 0.55, autophagy: 0.08, insulin: 0.52, gaba: 0.30, nad: 0.42, cortisol: 0.70, coreTemp: 0.68, liver: 0.10, kidney: 0.12, label: "SNACK" },
    11: { mtor: 0.45, autophagy: 0.10, insulin: 0.42, gaba: 0.32, nad: 0.44, cortisol: 0.65, coreTemp: 0.70, liver: 0.08, kidney: 0.10, label: "Pre-lunch" },
    12: { mtor: 0.75, autophagy: 0.06, insulin: 0.72, gaba: 0.30, nad: 0.40, cortisol: 0.58, coreTemp: 0.72, liver: 0.18, kidney: 0.22, label: "LUNCH" },
    13: { mtor: 0.62, autophagy: 0.08, insulin: 0.60, gaba: 0.32, nad: 0.42, cortisol: 0.52, coreTemp: 0.74, liver: 0.15, kidney: 0.18, label: "Post-lunch" },
    14: { mtor: 0.48, autophagy: 0.10, insulin: 0.45, gaba: 0.35, nad: 0.44, cortisol: 0.48, coreTemp: 0.72, liver: 0.10, kidney: 0.12, label: "Afternoon" },
    15: { mtor: 0.55, autophagy: 0.08, insulin: 0.52, gaba: 0.35, nad: 0.42, cortisol: 0.42, coreTemp: 0.70, liver: 0.12, kidney: 0.14, label: "SNACK" },
    16: { mtor: 0.45, autophagy: 0.10, insulin: 0.42, gaba: 0.38, nad: 0.44, cortisol: 0.38, coreTemp: 0.68, liver: 0.08, kidney: 0.10, label: "Late afternoon" },
    17: { mtor: 0.38, autophagy: 0.12, insulin: 0.35, gaba: 0.40, nad: 0.45, cortisol: 0.35, coreTemp: 0.66, liver: 0.06, kidney: 0.08, label: "Early evening" },
    18: { mtor: 0.72, autophagy: 0.06, insulin: 0.75, gaba: 0.42, nad: 0.40, cortisol: 0.32, coreTemp: 0.64, liver: 0.20, kidney: 0.25, label: "DINNER" },
    19: { mtor: 0.58, autophagy: 0.08, insulin: 0.58, gaba: 0.45, nad: 0.42, cortisol: 0.28, coreTemp: 0.60, liver: 0.15, kidney: 0.18, label: "Post-dinner" },
    20: { mtor: 0.45, autophagy: 0.10, insulin: 0.45, gaba: 0.50, nad: 0.44, cortisol: 0.25, coreTemp: 0.56, liver: 0.10, kidney: 0.12, label: "Evening" },
    21: { mtor: 0.38, autophagy: 0.12, insulin: 0.38, gaba: 0.55, nad: 0.45, cortisol: 0.22, coreTemp: 0.52, liver: 0.08, kidney: 0.10, label: "Evening" },
    22: { mtor: 0.52, autophagy: 0.08, insulin: 0.55, gaba: 0.58, nad: 0.42, cortisol: 0.20, coreTemp: 0.50, liver: 0.12, kidney: 0.15, label: "LATE SNACK" },
    23: { mtor: 0.40, autophagy: 0.12, insulin: 0.42, gaba: 0.62, nad: 0.44, cortisol: 0.18, coreTemp: 0.46, liver: 0.08, kidney: 0.10, label: "Pre-bed" },
    24: { mtor: 0.30, autophagy: 0.15, insulin: 0.28, gaba: 0.65, nad: 0.45, cortisol: 0.15, coreTemp: 0.44, liver: 0.05, kidney: 0.06, label: "Bedtime" }
  };
  
  return Object.entries(keyPoints).map(([h, data]) => ({
    hour: parseInt(h),
    clockTime: `${(parseInt(h) % 24).toString().padStart(2, '0')}:00`,
    ...data
  }));
};
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm shadow-xl max-w-xs">
      <p className="font-medium text-white">{data?.clockTime}</p>
      <p className="text-xs text-slate-400 mb-2">{data?.label}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        {payload.filter(e => e.value > 0).map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {(entry.value * 100).toFixed(0)}%
          </p>
        ))}
      </div>
    </div>
  );
};
const renderMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let listItems = [];
  
  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside my-2 space-y-1 text-slate-300">
          {listItems.map((item, i) => <li key={i}>{processInline(item)}</li>)}
        </ul>
      );
      listItems = [];
    }
  };
  
  const processInline = (line) => {
    line = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-100">$1</strong>');
    line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
    line = line.replace(/`(.+?)`/g, '<code class="bg-slate-700 px-1 rounded text-xs text-emerald-300">$1</code>');
    return <span dangerouslySetInnerHTML={{ __html: line }} />;
  };
  
  lines.forEach((line, i) => {
    if (line.startsWith('### ')) { flushList(); elements.push(<h4 key={i} className="font-semibold text-slate-200 mt-3 mb-1 text-sm">{line.slice(4)}</h4>); return; }
    if (line.startsWith('## ')) { flushList(); elements.push(<h3 key={i} className="font-semibold text-slate-100 mt-3 mb-1">{line.slice(3)}</h3>); return; }
    if (line.match(/^[\-\*]\s/)) { listItems.push(line.slice(2)); return; }
    if (line.match(/^\d+\.\s/)) { listItems.push(line.replace(/^\d+\.\s/, '')); return; }
    if (line.trim()) { flushList(); elements.push(<p key={i} className="my-1 text-slate-300">{processInline(line)}</p>); }
  });
  flushList();
  return <div className="space-y-1">{elements}</div>;
};
// Info Panel Component - Clean scientific format
const InfoPanel = ({ onClose }) => (
  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 space-y-4 text-sm text-slate-300">
    <div className="flex justify-between items-start">
      <h3 className="font-semibold text-lg text-slate-100">Stack Rationale</h3>
      <button onClick={onClose} className="text-slate-500 hover:text-white text-xl leading-none">×</button>
    </div>
    
    <div className="space-y-4">
      <section>
        <h4 className="font-medium text-slate-100 mb-2">1. The Longevity Evidence Hierarchy</h4>
        <p className="mb-2">
          Caloric restriction (CR) remains the most robust longevity intervention across species. 30% CR extends median lifespan 30-40% in rodents and improves healthspan markers in primates and humans (Mattison et al., 2017, Nature Communications).
        </p>
        <p className="mb-2">
          The key insight: CR works primarily through reduced mTOR signaling and increased autophagy, not through weight loss per se. Rapamycin (direct mTOR inhibitor) extends mouse lifespan ~25% even when started late in life (Harrison et al., 2009, Nature).
        </p>
        <p>
          Time-restricted eating (TRE) captures many CR benefits without caloric deficit by compressing eating into a defined window, allowing extended fasting periods where autophagy can operate (Longo & Panda, 2016, Cell Metabolism).
        </p>
      </section>
      <section>
        <h4 className="font-medium text-slate-100 mb-2">2. The Core Tradeoff: Growth vs. Maintenance</h4>
        <p className="mb-2">
          Cells cannot simultaneously run growth programs (mTOR) and cleanup programs (autophagy). mTOR phosphorylates and inhibits ULK1, the autophagy initiation kinase. This is a molecular switch, not a dial.
        </p>
        <p className="mb-2">
          Chronic mTOR activation (constant eating, high protein) suppresses autophagy → accumulation of damaged proteins, dysfunctional mitochondria, and senescent cells. This is the "hyperfunction" theory of aging (Blagosklonny, 2012, Cell Cycle).
        </p>
        <p>
          Optimal strategy: cycle between states. Extended fasting (16-18h) for deep autophagy, followed by protein-rich meals for targeted mTOR activation and tissue repair. Neither pathway should dominate 24/7.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-slate-100 mb-2">3. Why 16-18h Fasting Specifically?</h4>
        <p className="mb-2">
          Autophagy upregulation is time-dependent. In humans, significant autophagy markers (LC3-II, p62 clearance) appear after 12-16 hours of fasting. Peak activity occurs around 18-24 hours (Bagherniya et al., 2018, Autophagy).
        </p>
        <p className="mb-2">
          Shorter fasts (12h overnight) provide minimal autophagy. The 16-18h window balances depth of autophagy with sustainability. Longer fasts (24-72h) show diminishing returns for daily practice and risk muscle catabolism.
        </p>
        <p>
          This stack uses a 17h fast (7pm dinner → 12pm lunch), hitting peak autophagy at 11am, then strategically breaking with protein + leucine to maximize the mTOR pulse for muscle protein synthesis.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-slate-100 mb-2">4. Supplement Timing Logic</h4>
        <p className="mb-2">
          Morning fasted (9am): Autophagy amplifiers. Spermidine induces autophagy via AMPK activation and EP300 inhibition. EGCG and pterostilbene activate AMPK and sirtuins. These compounds enhance already-active autophagy machinery; taking them fed wastes their potential.
        </p>
        <p className="mb-2">
          With first meal (12pm): Fat-soluble compounds (D3, K2, E, fish oil, lutein) require dietary fat for absorption. Leucine (3g) ensures mTOR activation threshold for muscle protein synthesis (Norton & Layman, 2006, Journal of Nutrition).
        </p>
        <p className="mb-2">
          Afternoon: Quercetin (senolytic, clears senescent cells - Zhu et al., 2015, Aging Cell) and liver-processing compounds distributed to avoid morning bottleneck.
        </p>
        <p>
          Evening: GABA-ergic stack (glycine, magnesium, theanine, inositol) for sleep preparation. Glycine lowers core body temperature by ~0.5°C, a proven sleep-onset mechanism (Bannai et al., 2012, Sleep and Biological Rhythms).
        </p>
      </section>
      <section>
        <h4 className="font-medium text-slate-100 mb-2">5. NAD+ and the Sirtuins</h4>
        <p className="mb-2">
          NAD+ levels decline ~50% between ages 40-60. NAD+ is required for sirtuin function (SIRT1-7), DNA repair enzymes (PARPs), and mitochondrial function. This decline correlates with metabolic dysfunction and aging phenotypes (Yoshino et al., 2018, Cell Metabolism).
        </p>
        <p>
          Nicotinamide riboside (NR) is a NAD+ precursor that reliably elevates NAD+ in humans (~60% increase at 1000mg/day - Martens et al., 2018, Nature Communications). Morning dosing synergizes with fasted state and avoids evening stimulation.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-slate-100 mb-2">6. Expected Outcomes</h4>
        <p className="mb-2">
          Short-term (2-4 weeks): Improved sleep onset and quality (glycine, circadian alignment), stable daytime energy (no insulin crashes), reduced systemic inflammation markers, better mental clarity during fasting window.
        </p>
        <p className="mb-2">
          Medium-term (2-6 months): Improved body composition (enhanced metabolic flexibility, better insulin sensitivity), visible skin improvements (collagen support stack), reduced recovery time from exercise.
        </p>
        <p>
          Long-term (theoretical, based on mechanism): Reduced senescent cell burden, maintained NAD+ levels, preserved autophagy capacity with age, potentially slower epigenetic aging (this is the hypothesis being tested in ongoing human trials with similar interventions).
        </p>
      </section>
      <section>
        <h4 className="font-medium text-slate-100 mb-2">7. Key References</h4>
        <p className="text-xs text-slate-400">
          Harrison et al. (2009) Rapamycin fed late in life extends lifespan. Nature 460:392-395 • 
          Longo & Panda (2016) Fasting, circadian rhythms, and time-restricted feeding. Cell Metabolism 23:1048-1059 • 
          Mattison et al. (2017) Caloric restriction improves health and survival of rhesus monkeys. Nature Communications 8:14063 • 
          Blagosklonny (2012) Answering the ultimate question: what is the proximal cause of aging? Cell Cycle 11:2559-2567 • 
          Zhu et al. (2015) The Achilles' heel of senescent cells: from transcriptome to senolytic drugs. Aging Cell 14:644-658 • 
          Yoshino et al. (2018) NAD+ intermediates: the biology and therapeutic potential. Cell Metabolism 27:513-528
        </p>
      </section>
    </div>
  </div>
);
export default function HealthStackOptimizer() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [configText, setConfigText] = useState('');
  const [expandedSupp, setExpandedSupp] = useState(null);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [configError, setConfigError] = useState(null);
  const [dietMode, setDietMode] = useState('optimized');
  const [visiblePathways, setVisiblePathways] = useState({
    mtor: true, autophagy: true, insulin: false, gaba: true, nad: false, 
    cortisol: true, coreTemp: true, liver: true, kidney: true
  });
  const morningOffset = config?.settings?.morning_offset || 9;
  const optimizedData = generateOptimizedData(config?.schedule || {}, morningOffset);
  const westernData = generateWesternData();
  const timelineData = dietMode === 'optimized' ? optimizedData : westernData;
  
  const dailyTotals = { calories: 0, protein: 0, fastingHours: 17 };
  Object.values(config?.schedule || {}).forEach(period => {
    [...(period?.oral || []), ...(period?.with_food || [])].forEach(supp => {
      if (supp.macros?.calories) dailyTotals.calories += parseInt(supp.macros.calories) || 0;
      if (supp.macros?.protein) dailyTotals.protein += parseInt(supp.macros.protein) || 0;
    });
  });
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await window.storage.get('health-stack-v15');
        if (stored?.value) {
          const parsed = JSON.parse(stored.value);
          setConfig(parsed);
          setConfigText(JSON.stringify(parsed, null, 2));
        } else {
          setConfigText(JSON.stringify(DEFAULT_CONFIG, null, 2));
        }
      } catch {
        setConfigText(JSON.stringify(DEFAULT_CONFIG, null, 2));
      }
    };
    load();
  }, []);
  const saveConfig = async () => {
    try {
      const parsed = JSON.parse(configText);
      await window.storage.set('health-stack-v15', JSON.stringify(parsed));
      setConfig(parsed);
      setConfigError(null);
      setShowConfig(false);
    } catch (e) {
      setConfigError('Invalid JSON: ' + e.message);
    }
  };
  const sendAiMessage = async (customMessage) => {
    const msg = customMessage || aiInput.trim();
    if (!msg || aiLoading) return;
    if (!customMessage) setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', content: msg }]);
    setAiLoading(true);
    
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: `You are a health optimization assistant. User's supplement stack:\n${JSON.stringify(config, null, 2)}\n\n17h fasting (7pm-12pm). Eating 12pm-7pm.\nDaily: ~${dailyTotals.calories}kcal, ~${dailyTotals.protein}g protein.\nBe concise, evidence-based. Use markdown.`,
          messages: [...aiMessages.slice(-10), { role: 'user', content: msg }]
        })
      });
      const data = await res.json();
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.content?.[0]?.text || 'Error' }]);
    } catch {
      setAiMessages(prev => [...prev, { role: 'assistant', content: 'Connection error' }]);
    }
    setAiLoading(false);
  };
  const schedule = config?.schedule || {};
  const future = config?.future || [];
  const pathwayConfig = [
    { key: 'autophagy', name: 'Autophagy', color: '#10b981', type: 'area' },
    { key: 'mtor', name: 'mTOR', color: '#f59e0b', type: 'area' },
    { key: 'cortisol', name: 'Cortisol', color: '#f43f5e', type: 'line', dash: '6 3' },
    { key: 'coreTemp', name: 'Core Temp', color: '#ec4899', type: 'line', dash: '3 3' },
    { key: 'gaba', name: 'GABA', color: '#8b5cf6', type: 'line' },
    { key: 'nad', name: 'NAD+', color: '#06b6d4', type: 'line' },
    { key: 'insulin', name: 'Insulin', color: '#ef4444', type: 'line', dash: '4 2' },
    { key: 'liver', name: 'Liver', color: '#f97316', type: 'bar' },
    { key: 'kidney', name: 'Kidney', color: '#0ea5e9', type: 'bar' }
  ];
  const periodColors = {
    morning: { border: 'border-emerald-500/30', accent: 'text-emerald-400', bg: 'bg-emerald-950/20' },
    midday: { border: 'border-amber-500/30', accent: 'text-amber-400', bg: 'bg-amber-950/20' },
    afternoon: { border: 'border-blue-500/30', accent: 'text-blue-400', bg: 'bg-blue-950/20' },
    late_afternoon: { border: 'border-lime-500/30', accent: 'text-lime-400', bg: 'bg-lime-950/20' },
    dinner: { border: 'border-red-500/30', accent: 'text-red-400', bg: 'bg-red-950/20' },
    wind_down: { border: 'border-violet-500/30', accent: 'text-violet-400', bg: 'bg-violet-950/20' },
    bedtime: { border: 'border-slate-500/30', accent: 'text-slate-400', bg: 'bg-slate-800/30' }
  };
  const renderSupplementPill = (supp) => (
    <button
      key={supp.id}
      onClick={() => setExpandedSupp(expandedSupp === supp.id ? null : supp.id)}
      className={`px-2 py-0.5 rounded text-xs transition-all ${
        expandedSupp === supp.id ? 'bg-slate-600 ring-1 ring-slate-400' : 'bg-slate-800/60 hover:bg-slate-700'
      }`}
    >
      <span className="text-slate-200">{supp.name}</span>
      <span className="text-slate-500 ml-1">{supp.dose}</span>
    </button>
  );
  const renderExpandedSupp = (supp) => (
    <div key={`exp-${supp.id}`} className="bg-slate-800/80 rounded-lg p-3 mt-2 text-sm space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <span className="font-medium text-slate-200">{supp.name}</span>
          <span className="text-slate-500 ml-2">{supp.dose}</span>
        </div>
        <button onClick={() => setExpandedSupp(null)} className="text-slate-500 hover:text-white">×</button>
      </div>
      <p className="text-xs text-slate-400">{supp.benefits}</p>
      <div className="flex flex-wrap gap-1">
        {supp.pathways?.map((p, i) => (
          <span key={i} className="px-1.5 py-0.5 bg-slate-700 rounded text-xs text-slate-300">{p}</span>
        ))}
      </div>
      {supp.macros && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs py-2 border-y border-slate-700">
          {supp.macros.calories && <span><span className="text-slate-500">Cal:</span> <span className="text-amber-300">{supp.macros.calories}</span></span>}
          <span><span className="text-slate-500">P:</span> <span className="text-slate-300">{supp.macros.protein}</span></span>
          <span><span className="text-slate-500">C:</span> <span className="text-slate-300">{supp.macros.carbs}</span></span>
          <span><span className="text-slate-500">F:</span> <span className="text-slate-300">{supp.macros.fat}</span></span>
        </div>
      )}
      {supp.components && (
        <div className="text-xs grid grid-cols-2 gap-x-4 gap-y-0.5">
          {supp.components.map((c, i) => (
            <div key={i} className="flex">
              <span className="text-slate-400">{c.name}</span>
              <span className="text-slate-600 ml-1 truncate">{c.detail}</span>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => sendAiMessage(`Tell me about ${supp.name} (${supp.dose}): mechanisms, timing, interactions?`)}
        className="px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded text-xs hover:bg-emerald-600/30"
      >
        🤖 Ask AI
      </button>
    </div>
  );
  const getClockTime = (timeOffset) => {
    const hour = (morningOffset + timeOffset) % 24;
    return `${hour.toString().padStart(2, '0')}:00`;
  };
  const labelPositions = dietMode === 'optimized' 
    ? [
        { label: 'Sleep', pos: '8%' },
        { label: 'Peak Autophagy', pos: '42%', highlight: true },
        { label: 'Lunch', pos: '52%' },
        { label: 'Salad', pos: '67%' },
        { label: 'Dinner', pos: '79%' },
        { label: 'Wind-down', pos: '96%' }
      ]
    : [
        { label: 'Sleep', pos: '8%' },
        { label: 'Breakfast', pos: '30%' },
        { label: 'Snack', pos: '42%' },
        { label: 'Lunch', pos: '52%' },
        { label: 'Snack', pos: '63%' },
        { label: 'Dinner', pos: '75%' },
        { label: 'Late Snack', pos: '92%', warning: true }
      ];
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">⚗️ Health Stack</h1>
            <div className="flex gap-3 text-xs">
              <span className="text-amber-400">{dailyTotals.calories} kcal</span>
              <span className="text-slate-400">{dailyTotals.protein}g protein</span>
              <span className="text-emerald-400">{dailyTotals.fastingHours}h fast</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowInfo(!showInfo)} 
              className={`px-3 py-1.5 rounded text-sm ${showInfo ? 'bg-cyan-700' : 'hover:bg-slate-800'}`}
              title="Stack Rationale"
            >
              ℹ️
            </button>
            <button 
              onClick={() => setShowConfig(!showConfig)} 
              className={`px-3 py-1.5 rounded text-sm ${showConfig ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4 space-y-4">
        {showInfo && <InfoPanel onClose={() => setShowInfo(false)} />}
        
        {showConfig && (
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Configuration</h3>
              <div className="flex gap-2">
                <button onClick={() => { setConfig(DEFAULT_CONFIG); setConfigText(JSON.stringify(DEFAULT_CONFIG, null, 2)); }} className="px-3 py-1 bg-slate-700 rounded text-sm">Reset</button>
                <button onClick={saveConfig} className="px-3 py-1 bg-emerald-600 rounded text-sm">Save</button>
              </div>
            </div>
            {configError && <p className="text-red-400 text-sm mb-2">{configError}</p>}
            <textarea value={configText} onChange={e => setConfigText(e.target.value)} className="w-full h-64 bg-slate-900 rounded p-3 font-mono text-xs text-slate-300 border border-slate-600" spellCheck={false} />
          </div>
        )}
        {/* 24h Chart */}
        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <div className="flex bg-slate-800 rounded p-0.5 mr-3">
              <button
                onClick={() => setDietMode('optimized')}
                className={`px-2 py-0.5 rounded text-xs transition-all ${dietMode === 'optimized' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Optimized
              </button>
              <button
                onClick={() => setDietMode('western')}
                className={`px-2 py-0.5 rounded text-xs transition-all ${dietMode === 'western' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Western
              </button>
            </div>
            
            {pathwayConfig.map(p => (
              <button
                key={p.key}
                onClick={() => setVisiblePathways(prev => ({ ...prev, [p.key]: !prev[p.key] }))}
                className={`px-1.5 py-0.5 rounded text-xs flex items-center gap-1 transition-opacity ${visiblePathways[p.key] ? 'opacity-100' : 'opacity-30'}`}
                style={{ backgroundColor: p.color + '18', color: p.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}
              </button>
            ))}
          </div>
          
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timelineData} margin={{ top: 5, right: 5, left: -28, bottom: 5 }}>
                <defs>
                  <linearGradient id="g-autophagy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="g-mtor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                
                {dietMode === 'optimized' ? (
                  <>
                    <ReferenceArea x1={0} x2={7} fill="#8b5cf6" fillOpacity={0.04} />
                    <ReferenceArea x1={9} x2={12} fill="#10b981" fillOpacity={0.08} />
                    <ReferenceLine x={12} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <ReferenceLine x={16} stroke="#84cc16" strokeDasharray="3 3" strokeOpacity={0.4} />
                    <ReferenceLine x={19} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <ReferenceLine x={23} stroke="#8b5cf6" strokeDasharray="3 3" strokeOpacity={0.4} />
                  </>
                ) : (
                  <>
                    <ReferenceLine x={7} stroke="#f59e0b" strokeWidth={2} strokeOpacity={0.6} />
                    <ReferenceLine x={10} stroke="#f97316" strokeDasharray="3 3" strokeOpacity={0.4} />
                    <ReferenceLine x={12} stroke="#f59e0b" strokeWidth={2} strokeOpacity={0.6} />
                    <ReferenceLine x={15} stroke="#f97316" strokeDasharray="3 3" strokeOpacity={0.4} />
                    <ReferenceLine x={18} stroke="#ef4444" strokeWidth={2} strokeOpacity={0.6} />
                    <ReferenceLine x={22} stroke="#ef4444" strokeWidth={2} strokeOpacity={0.8} />
                  </>
                )}
                
                <XAxis 
                  dataKey="hour" 
                  stroke="#475569" 
                  fontSize={8} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(h) => h % 24}
                  ticks={[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]}
                  interval={0}
                />
                <YAxis stroke="#475569" fontSize={9} tickFormatter={v => `${(v*100).toFixed(0)}%`} tickLine={false} axisLine={false} domain={[0, 1]} />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Always render all elements, control visibility via opacity */}
                <Area 
                  type="monotone" 
                  dataKey="autophagy" 
                  name="Autophagy" 
                  stroke="#10b981" 
                  fill="url(#g-autophagy)" 
                  strokeWidth={2.5} 
                  strokeOpacity={visiblePathways.autophagy ? 1 : 0}
                  fillOpacity={visiblePathways.autophagy ? 1 : 0}
                />
                <Area 
                  type="monotone" 
                  dataKey="mtor" 
                  name="mTOR" 
                  stroke="#f59e0b" 
                  fill="url(#g-mtor)" 
                  strokeWidth={2}
                  strokeOpacity={visiblePathways.mtor ? 1 : 0}
                  fillOpacity={visiblePathways.mtor ? 1 : 0}
                />
                <Line 
                  type="monotone" 
                  dataKey="gaba" 
                  name="GABA" 
                  stroke="#8b5cf6" 
                  strokeWidth={2} 
                  dot={false}
                  strokeOpacity={visiblePathways.gaba ? 1 : 0}
                />
                <Line 
                  type="monotone" 
                  dataKey="cortisol" 
                  name="Cortisol" 
                  stroke="#f43f5e" 
                  strokeWidth={1.5} 
                  dot={false} 
                  strokeDasharray="6 3"
                  strokeOpacity={visiblePathways.cortisol ? 1 : 0}
                />
                <Line 
                  type="monotone" 
                  dataKey="coreTemp" 
                  name="Core Temp" 
                  stroke="#ec4899" 
                  strokeWidth={1.5} 
                  dot={false} 
                  strokeDasharray="3 3"
                  strokeOpacity={visiblePathways.coreTemp ? 1 : 0}
                />
                <Line 
                  type="monotone" 
                  dataKey="nad" 
                  name="NAD+" 
                  stroke="#06b6d4" 
                  strokeWidth={1.5} 
                  dot={false}
                  strokeOpacity={visiblePathways.nad ? 1 : 0}
                />
                <Line 
                  type="monotone" 
                  dataKey="insulin" 
                  name="Insulin" 
                  stroke="#ef4444" 
                  strokeWidth={1.5} 
                  dot={false} 
                  strokeDasharray="4 2"
                  strokeOpacity={visiblePathways.insulin ? 1 : 0}
                />
                <Bar 
                  dataKey="liver" 
                  name="Liver" 
                  fill="#f97316" 
                  fillOpacity={visiblePathways.liver ? 0.6 : 0}
                />
                <Bar 
                  dataKey="kidney" 
                  name="Kidney" 
                  fill="#0ea5e9" 
                  fillOpacity={visiblePathways.kidney ? 0.4 : 0}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div className="relative h-5 mt-1">
            {labelPositions.map((l, i) => (
              <span 
                key={i} 
                className={`absolute text-xs transform -translate-x-1/2 ${l.highlight ? 'text-emerald-400' : l.warning ? 'text-red-400' : 'text-slate-600'}`}
                style={{ left: l.pos }}
              >
                {l.label}
              </span>
            ))}
          </div>
          
          {dietMode === 'western' && (
            <p className="text-xs text-orange-400/70 mt-2 text-center">
              Western pattern: Autophagy max ~35% vs 88% optimized. Constant insulin/mTOR. Late snacking disrupts overnight repair.
            </p>
          )}
        </div>
        {dietMode === 'optimized' && (
          <div className="grid gap-3">
            {Object.entries(schedule).map(([key, period]) => {
              if (!period) return null;
              const colors = periodColors[key] || periodColors.morning;
              const oral = period.oral || [];
              const withFood = period.with_food || [];
              const uti = period.uti || [];
              const separate = period.separate || [];
              const skinTopical = period.skin_topical || [];
              const scalpTopical = period.scalp_topical || [];
              
              const allOral = [...oral, ...withFood, ...uti, ...separate];
              const clockTime = getClockTime(period.time || 0);
              const hasContent = allOral.length > 0 || skinTopical.length > 0 || scalpTopical.length > 0 || period.notes;
              
              if (!hasContent) return null;
              
              return (
                <div key={key} className={`rounded-lg p-3 border ${colors.border} ${colors.bg}`}>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xs text-slate-500 font-mono w-12">{clockTime}</span>
                    <h3 className={`font-medium ${colors.accent}`}>{period.label}</h3>
                    <span className="text-xs text-slate-600">{period.note}</span>
                  </div>
                  
                  <div className="space-y-1.5 pl-14">
                    {oral.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-slate-600 w-12">Oral:</span>
                        <div className="flex flex-wrap gap-1 flex-1">{oral.map(renderSupplementPill)}</div>
                      </div>
                    )}
                    
                    {withFood.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-slate-600 w-12">w/ food:</span>
                        <div className="flex flex-wrap gap-1 flex-1">{withFood.map(renderSupplementPill)}</div>
                      </div>
                    )}
                    
                    {uti.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-slate-600 w-12">UTI:</span>
                        <div className="flex flex-wrap gap-1 flex-1">{uti.map(renderSupplementPill)}</div>
                      </div>
                    )}
                    
                    {separate.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-orange-500 w-12">⚠️:</span>
                        <div className="flex flex-wrap gap-1 flex-1">{separate.map(renderSupplementPill)}</div>
                      </div>
                    )}
                    
                    {allOral.filter(s => expandedSupp === s.id).map(renderExpandedSupp)}
                    
                    {skinTopical.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-700/30">
                        <span className="text-xs text-slate-600 w-12">Skin:</span>
                        <div className="flex flex-wrap gap-1 flex-1">
                          {skinTopical.map((s, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-pink-900/20 border border-pink-800/30 rounded text-xs text-pink-300/70" title={`${s.product}${s.note ? ` - ${s.note}` : ''}`}>
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {scalpTopical.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-slate-600 w-12">Scalp:</span>
                        <div className="flex flex-wrap gap-1 flex-1">
                          {scalpTopical.map((s, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-cyan-900/20 border border-cyan-800/30 rounded text-xs text-cyan-300/70" title={`${s.product}${s.note ? ` - ${s.note}` : ''}`}>
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {period.circadian && (
                      <p className="text-xs text-pink-400/60 pt-1">🌙 {period.circadian}</p>
                    )}
                    
                    {period.notes && <p className="text-xs text-slate-500 italic pt-1">💡 {period.notes}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50">
          <div className="p-2 border-b border-slate-700/50 flex items-center justify-between">
            <span className="text-sm text-slate-400">🤖 AI</span>
            {aiMessages.length > 0 && <button onClick={() => setAiMessages([])} className="text-xs text-slate-600 hover:text-slate-400">Clear</button>}
          </div>
          
          {aiMessages.length > 0 && (
            <div className="max-h-64 overflow-y-auto p-3 space-y-2">
              {aiMessages.map((m, i) => (
                <div key={i} className={`p-2 rounded text-xs ${m.role === 'user' ? 'bg-slate-700/50 ml-12' : 'bg-slate-800 mr-4'}`}>
                  {m.role === 'assistant' ? renderMarkdown(m.content) : <p className="text-slate-300">{m.content}</p>}
                </div>
              ))}
              {aiLoading && <div className="text-xs text-slate-500 p-2">Thinking...</div>}
            </div>
          )}
          
          <div className="p-2 flex gap-2">
            <input
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendAiMessage()}
              placeholder="Ask about supplements, timing, interactions..."
              className="flex-1 bg-slate-900/50 border border-slate-700 rounded px-3 py-1.5 text-sm placeholder:text-slate-600"
            />
            <button onClick={() => sendAiMessage()} disabled={aiLoading || !aiInput.trim()} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 rounded text-sm">
              Send
            </button>
          </div>
        </div>
        {future.length > 0 && dietMode === 'optimized' && (
          <div>
            <p className="text-xs text-slate-600 mb-1.5">Planned additions</p>
            <div className="flex flex-wrap gap-1.5">
              {future.map((f, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-800/20 border border-slate-700/30 rounded text-xs text-slate-500" title={f.rationale}>{f.item}</span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
