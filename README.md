# Cymulate Automation Project

This project automates testing for Cymulate's Web Application Firewall (WAF) module using Playwright and TypeScript. It includes tests to validate reports, download CSVs, and ensure data correctness.

---

## Prerequisites

Before you can run this project, ensure you have the following installed:

- **Node.js** (v14 or later)
- **npm** (Node Package Manager) or **yarn**
- A **modern browser** (Google Chrome or Chromium is recommended)
- **Git** (to clone the repository)

---

## Setup Instructions

1. **Clone the Repository**
   
   git clone git@github.com:talakalo/cymulate-automation.git
   cd cymulate-automation
   npm install

2. **Install Dependencies Run the following command to install all the required dependencies:**
        npm install


## Execution of Tests


1. **Run Tests Using UI**
    npx playwright test --ui

2.  **Run Spesific Spec file**
    npx playwright test src/tests/cymulate.spec.ts

3.  **All Tests**
    npx playwright test

4.  **View Reports**
    npx playwright show-report




