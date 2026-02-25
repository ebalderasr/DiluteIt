# 🧪 DiluteIt | Host Cell Lab Suite
> **Universal dilution solver. Fast, clear, and lab-ready.**

DiluteIt is a lightweight web app for solving the universal dilution equation (**C1V1 = C2V2**) in a clean, mobile-friendly interface.  
It is part of **Host Cell**, a growing suite of practical laboratory and bioprocess tools built by **Emiliano Balderas** (IBt-UNAM).

<p align="center">
  <img src="icon-512.png" width="180" alt="DiluteIt Logo">
</p>

<p align="center">
  <a href="https://ebalderasr.github.io/DiluteIt/">
    <img src="https://img.shields.io/badge/🚀_Launch_Live_App-DiluteIt-ff9800?style=for-the-badge&labelColor=000000" alt="Launch DiluteIt App">
  </a>
</p>

<p align="center">
  <a href="https://github.com/ebalderasr/DiluteIt">Repo</a> •
  <a href="https://ebalderasr.github.io/DiluteIt/">Live App</a>
</p>

---

## What is DiluteIt?

**DiluteIt** solves one of the most common calculations in biotechnology and lab workflows: **dilution planning**.

The app lets you solve for **any one** of the four variables in the dilution equation:

- **C1** = stock concentration  
- **V1** = stock volume (aliquot / inoculum)  
- **C2** = target final concentration  
- **V2** = final total volume  

You choose the unknown, provide the other three values, and the app returns the result with unit-aware handling.

---

## 🧬 Scientific Fundamentals

DiluteIt applies the dilution equation derived from conservation of solute amount:

$$C_1V_1 = C_2V_2$$

### Variable definitions
- **C1**: concentration of the stock solution
- **V1**: volume of stock used (aliquot / inoculum)
- **C2**: desired final concentration
- **V2**: final total volume

### Rearranged forms (examples)
Depending on the unknown variable, the app solves:

$$V_1 = \frac{C_2 \times V_2}{C_1}$$

$$C_1 = \frac{C_2 \times V_2}{V_1}$$

$$C_2 = \frac{C_1 \times V_1}{V_2}$$

$$V_2 = \frac{C_1 \times V_1}{C_2}$$

---

## ✅ Unit Logic (Important)

DiluteIt supports practical concentration and volume units for routine lab use.

### Supported concentration bases
- **M**, **mM**, **μM** (molar basis)
- **mg/mL** (mass/volume basis)
- **%** (percentage basis)

### Supported volume units
- **L**
- **mL**
- **μL**

### Correct use rule
DiluteIt assumes **C1 and C2 use the same concentration basis**.

✅ Valid examples:
- M ↔ mM ↔ μM  
- mg/mL ↔ mg/mL  
- % ↔ %

❌ Not valid without extra information:
- M ↔ mg/mL
- % ↔ M
- mg/mL ↔ % (unless convention + density/purity are defined)

If you need cross-basis conversion (for example, molarity to mg/mL), you must use additional data such as:
- molecular weight (MW)
- density
- purity / assay

---

## ⚡ Features

- **Universal Solver:** Choose any of the 4 variables as the unknown (C1, V1, C2, or V2)
- **Unit-Aware Inputs:** Handles common lab concentration and volume units
- **Compatibility Validation:** Warns when C1 and C2 use incompatible concentration bases
- **Mobile-First UI:** High-contrast layout and large controls for real lab use
- **Bilingual Interface:** Spanish / English toggle
- **PWA Ready:** Installable on Android/iOS and usable offline after first load
- **Host Cell Design System:** Visual consistency with other tools in the suite

---

## 🔬 Typical Use Cases

DiluteIt is useful for:
- preparing working solutions from concentrated stocks
- serial dilution planning (step-by-step use)
- quick aliquot calculations at the bench
- training students on dilution logic
- reducing manual calculator/transcription errors

---

## 🚀 How to Use

1. **Select the unknown variable** (C1, V1, C2, or V2)
2. Enter the other **three known values**
3. Choose the corresponding **units**
4. Click **Solve**
5. Review the result and verify unit compatibility

### Example
If you need to prepare a final solution at **C2** from a stock **C1**:
- Enter **C1**, **C2**, **V2**
- Set **V1** as the unknown
- DiluteIt returns the required aliquot volume (**V1**)

---

## 📱 Installation (PWA)

DiluteIt can be installed as a Progressive Web App (PWA) for faster access and offline use.

### Android / Desktop (Chrome, Edge)
- Open the live app
- Tap/click **Install App** (if shown)
- Or use the browser install prompt/menu

### iPhone / iPad (Safari)
- Open the live app
- Tap **Share**
- Select **Add to Home Screen**

Once installed, the app can work offline after the required files are cached.

---

## ❓ FAQ

**Q: Does DiluteIt convert molarity to mg/mL automatically?**
**A:** No. The dilution equation preserves solute amount, but it does not perform cross-basis chemical conversions. You need MW (and sometimes density/purity) for that.

**Q: Can I solve for any variable?**
**A:** Yes. DiluteIt is a universal solver for **C1, V1, C2, or V2**, as long as the other three values are valid.

**Q: Does it work offline?**
**A:** Yes. After the first successful load (and installation, if desired), the service worker caches the app for offline use.

**Q: Is it only for bioprocessing?**
**A:** No. It was built within a biotech workflow, but the dilution math is broadly useful for many lab contexts.

---

## ⚠️ Notes and Limitations

* DiluteIt is a **calculation aid**, not a substitute for SOPs or experimental judgment.
* Always verify:

  * unit basis compatibility
  * concentration conventions (% w/v, v/v, etc.)
  * stock identity and labeling
  * pipetting feasibility and practical volume limits
* For critical workflows, follow institutional protocols and lab-specific validation practices.

---

## 👨‍🔬 Author

**Emiliano Balderas**
Biotechnology Engineer | PhD Student in Biochemistry
*Instituto de Biotecnología (IBt) - UNAM*

---

## 🧩 About Host Cell

**Host Cell** is a growing suite of practical lab and bioprocess tools focused on:

* clarity
* speed
* reproducibility
* real-world usability at the bench

DiluteIt is one module in that ecosystem.

---

**Host Cell Lab Suite** – *Practical tools for high-performance biotechnology.*