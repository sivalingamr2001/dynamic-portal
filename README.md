# B3 BIN PORTAL - Complete Documentation (A-Z)

**Portal Name:** B3 BIN PORTAL  
**Portal Role:** BIN Portal · Sales  
**Company:** JANATICS  
**Current User:** Rajan Kumar (Sales Manager)  
**Current Date:** 15 Jun 2026  

---

## TABLE OF CONTENTS
1. [Portal Structure](#portal-structure)
2. [Sidebar Navigation](#sidebar-navigation)
3. [BIN Allocation Module](#bin-allocation-module)
4. [Approval Module](#approval-module)
5. [Amendment Module](#amendment-module)
6. [Fulfillment Module](#fulfillment-module)
7. [Header Components](#header-components)
8. [Dashboard Widgets](#dashboard-widgets)
9. [Status Indicators](#status-indicators)
10. [Item Portfolio Data](#item-portfolio-data)

---

## PORTAL STRUCTURE

### Overall Layout
- **Left Sidebar:** Navigation menu with company branding and user profile
- **Header:** Current page title, date, and stats bar
- **Main Content Area:** Primary module content with forms and data tables
- **Right Sidebar:** Dashboard widgets and analytics

---

## SIDEBAR NAVIGATION

### Sidebar Header Section
- **Company Logo/Icon:** JANATICS branding
- **Company Name:** JANATICS
- **Portal Identifier:** BIN Portal · Sales

### Navigation Menu Screens

#### 1. **BIN Allocation**
- **Description:** Create forecast entries
- **Badge:** No badge
- **Status:** Default/Available
- **Purpose:** Create new BIN allocations and forecast commitments

#### 2. **Approval**
- **Description:** Approve item quantities
- **Badge:** 7 (number of items pending approval)
- **Status:** Active/Notification
- **Purpose:** Approve allocation items submitted for review

#### 3. **Amendment**
- **Description:** Amend or cancel items
- **Badge:** 1 (number of items with amendments)
- **Status:** Active/Notification
- **Purpose:** Modify approved items or cancel allocations

#### 4. **Fulfillment**
- **Description:** Track OA allocation
- **Badge:** No badge
- **Status:** Default/Available
- **Purpose:** Monitor allocation fulfillment and order acknowledgments

### User Profile Section (Bottom of Sidebar)
- **User Avatar/Icon:** Profile image
- **User Name:** Rajan Kumar
- **User Role:** Sales Manager

---

## HEADER COMPONENTS

### Header Layout
- **Page Icon:** Module-specific icon
- **Page Title:** Dynamic based on current module (e.g., "BIN Allocation", "Approval", etc.)
- **Page Description:** Short description of module functionality
- **Current Date:** 15 Jun 2026 (displayed on right)

### Header Stats Bar
Displays real-time metrics for the entire portal:

| Icon | Metric | Value | Description |
|------|--------|-------|-------------|
| 📊 | Total Items | 15 | Total items in the system |
| ⏳ | Pending | 7 | Items awaiting approval |
| 🔄 | Amend | 1 | Items with amendments |
| ✅ | Approved | 7 | Items already approved |

---

## BIN ALLOCATION MODULE

### Module Title
- **Main Title:** New BIN Allocation
- **Description:** Forecast commitment — allocate stock by customer or open pool
- **Action Button:** Submit for Approval (disabled when no items added)

### Form Section 1: Allocation Type
- **Field Label:** Allocation Type
- **Type:** Radio/Toggle buttons
- **Options:**
  - **Customer Specific** - Allocate to specific customer
  - **Open Pool (Any Customer)** - Allocate to open pool for any customer

### Form Section 2: Customer Selection
- **Field Label:** Customer * (required field)
- **Input Type:** Searchable textbox
- **Placeholder Text:** "Type customer name or code..."
- **Required:** Yes (marked with *)

### Form Section 3: Region Selection
- **Field Label:** Region * (required field)
- **Input Type:** Dropdown/Combobox
- **Required:** Yes (marked with *)
- **Default Option:** "Select state / region..."
- **Available Regions:**
  1. Maharashtra
  2. Tamil Nadu
  3. Karnataka
  4. Gujarat
  5. Delhi NCR
  6. Rajasthan
  7. West Bengal
  8. Telangana
  9. Punjab
  10. Uttar Pradesh
  11. Kerala
  12. Madhya Pradesh
  13. Andhra Pradesh
  14. Haryana
  15. Odisha

### Form Section 4: Item Lines
- **Section Title:** Item Lines
- **Add Row Button:** "Add Row" button to add new item entries

#### Item Lines Table Structure
- **Column Headers:**
  - \# (Row number)
  - Item Code
  - Item Name
  - Qty (BIN)
  - Target Date

#### Sample Row Fields
- **Row Number:** 1
- **Item Code Field:** Editable textbox with placeholder "Code / name..."
- **Item Name Field:** Displays "— select item code first" until code is selected
- **Quantity Field:** Spinbutton (numeric input with +/- controls)
- **Target Date Field:** Date picker
- **Delete Action:** Delete button (disabled for new rows)

#### Item Lines Summary
- **Summary Text:** "0 item line(s)"
- **Total Quantity:** "Total Qty: 0"

---

## APPROVAL MODULE

### Module Title
- **Main Title:** BIN Approval
- **Description:** Approve item quantities — locked once approved

### Filter & Search Section
- **Tab Buttons:**
  - **All** (Badge: 15 - all items)
  - **Pending** (Badge: 7 - awaiting approval)
  - **Amendment** (Badge: 1 - amendments pending)
  - **Approved** (Badge: 7 - already approved)

- **Search Field:** Searchable textbox
  - **Placeholder:** "Item, customer, region..."

- **Bulk Action Button:** "Approve All (8)" button

### Approval Table Structure

#### Column Headers
1. **\#** - Row number
2. **Item Code** - Sortable column
3. **Item Name** - Sortable column
4. **Customer** - Sortable with sort indicator
5. **Region** - Sortable column
6. **BIN Qty** - Sortable with sort indicator
7. **Approved Qty** - Approved/changed quantity
8. **Target Date** - Sortable with sort indicator
9. **Action** - Approve button for pending items

#### Sample Approval Items

**Item 1:**
- Row #: 1
- Item Code: RES-010K
- Item Name: Resistor 10K Ω 1%
- Customer: ABC Electronics Ltd
- Region: Maharashtra
- BIN Qty: 10,000
- Approved Qty: 10,000
- Target Date: 2024-12-10 (OD)
- Status: Approved

**Item 2:**
- Row #: 2
- Item Code: PCB-001
- Item Name: PCB Assembly Rev3
- Customer: ABC Electronics Ltd
- Region: Maharashtra
- BIN Qty: 500
- Approved Qty: 480-20
- Target Date: 2024-12-15 (OD)
- Status: Approved

**Item 3:**
- Row #: 3
- Item Code: PWR-24V
- Item Name: Power Supply 24V 5A
- Customer: Delta Manufacturing Co
- Region: Tamil Nadu
- BIN Qty: 50
- Approved Qty: 45-5
- Target Date: 2024-12-18 (OD)
- Status: Approved

**Item 4:**
- Row #: 4
- Item Code: MOT-DC12
- Item Name: DC Motor 12V 100RPM
- Customer: Delta Manufacturing Co
- Region: Tamil Nadu
- BIN Qty: 200
- Approved Qty: 200
- Target Date: 2024-12-20 (OD)
- Status: Approved

**Item 5:**
- Row #: 5
- Item Code: LED-RED
- Item Name: LED Red 5mm 20mA
- Customer: Open Pool
- Region: — (N/A for open pool)
- BIN Qty: 20,000
- Approved Qty: 18,000-2,000
- Target Date: 2024-12-22 (OD)
- Status: Approved

**Item 6:**
- Row #: 6
- Item Code: IC-555
- Item Name: IC Timer NE555P
- Customer: Open Pool
- Region: — (N/A for open pool)
- BIN Qty: 5,000
- Approved Qty: 5,000
- Target Date: 2024-12-25 (OD)
- Status: Approved

**Item 7:**
- Row #: 7
- Item Code: REL-12V
- Item Name: Relay 12V SPDT 10A
- Customer: Omega Systems Inc
- Region: Karnataka
- BIN Qty: 300
- Approved Qty: Spinbutton (300)
- Target Date: 2024-12-28 (OD)
- Status: Pending Approval (Approve button available)

**Item 8:**
- Row #: 8
- Item Code: CON-DB9
- Item Name: DB9 Connector Male
- Customer: Omega Systems Inc
- Region: Karnataka
- BIN Qty: 1,000
- Approved Qty: Spinbutton (1000)
- Target Date: 2024-12-30 (OD)
- Status: Pending Approval (Approve button available)

**Item 9:**
- Row #: 9
- Item Code: LED-RED
- Item Name: LED Red 5mm 20mA
- Customer: Open Pool
- Region: — (N/A for open pool)
- BIN Qty: 5,000
- Approved Qty: 5,000
- Target Date: 2024-12-31 (OD)
- Status: Approved

**Item 10:**
- Row #: 10
- Item Code: TRN-NPN
- Item Name: Transistor NPN BC547
- Customer: Prism Corp
- Region: Gujarat
- BIN Qty: 8,000
- Approved Qty: Spinbutton (8000)
- Target Date: 2025-01-05 (OD)
- Status: Pending Approval (Approve button available)

**Item 11:**
- Row #: 11
- Item Code: CAP-100U
- Item Name: Capacitor 100µF 50V
- Customer: Prism Corp
- Region: Gujarat
- BIN Qty: 3,000
- Approved Qty: Spinbutton (3000)
- Target Date: 2025-01-10 (OD)
- Status: Pending Approval (Approve button available)

**Item 12:**
- Row #: 12
- Item Code: PCB-001
- Item Name: PCB Assembly Rev3
- Customer: Open Pool
- Region: — (N/A for open pool)
- BIN Qty: 200
- Approved Qty: Spinbutton (200)
- Target Date: 2025-01-15 (OD)
- Status: Pending Approval (Approve button available)

**Item 13:**
- Row #: 13
- Item Code: SOL-VLV
- Item Name: Solenoid Valve 24VDC
- Customer: TechVision Ltd
- Region: Delhi NCR
- BIN Qty: 120
- Approved Qty: Spinbutton (120)
- Target Date: 2025-01-18 (OD)
- Status: Pending Approval (Approve button available)

**Item 14:**
- Row #: 14
- Item Code: PWR-24V
- Item Name: Power Supply 24V 5A
- Customer: TechVision Ltd
- Region: Delhi NCR
- BIN Qty: 75
- Approved Qty: Spinbutton (75)
- Target Date: 2025-01-20 (OD)
- Status: Pending Approval (Approve button available)

---

## AMENDMENT MODULE

### Module Title
- **Main Title:** Amendment / Cancellation
- **Description:** Select approved items to amend qty or cancel — will re-enter approval flow

### Search & Filter Section
- **Search Field:** Searchable textbox
  - **Placeholder:** "Search item, customer..."

- **Tab Buttons:**
  - **All** - View all items
  - **Approved** - Approved items eligible for amendment
  - **Amend Pending** - Items with pending amendments

### Amendment Table

#### Table Header Section
- **Select All Checkbox:** Checkbox to select/deselect all items
- **Label:** "Select items to amend"

#### Column Headers
1. **Checkbox** - Select individual items
2. **Item Code** - Item identifier
3. **Item Name** - Full item description
4. **Customer** - Customer name/pool
5. **Region** - Geographic region
6. **Appr. Qty** - Approved quantity
7. **Target Date** - Delivery target date

#### Sample Amendment Items

**Item 1: PCB-001**
- Item Name: PCB Assembly Rev3
- Customer: ABC Electronics Ltd
- Region: Maharashtra
- Approved Qty: 480
- Target Date: 2024-12-15

**Item 2: RES-010K**
- Item Name: Resistor 10K Ω 1%
- Customer: ABC Electronics Ltd
- Region: Maharashtra
- Approved Qty: 10,000
- Target Date: 2024-12-10

**Item 3: MOT-DC12**
- Item Name: DC Motor 12V 100RPM
- Customer: Delta Manufacturing Co
- Region: Tamil Nadu
- Approved Qty: 200
- Target Date: 2024-12-20

**Item 4: PWR-24V**
- Item Name: Power Supply 24V 5A
- Customer: Delta Manufacturing Co
- Region: Tamil Nadu
- Approved Qty: 45
- Target Date: 2024-12-18

**Item 5: IC-555**
- Item Name: IC Timer NE555P
- Customer: Open Pool
- Region: — (N/A)
- Approved Qty: 5,000
- Target Date: 2024-12-25

**Item 6: LED-RED**
- Item Name: LED Red 5mm 20mA
- Customer: Open Pool
- Region: — (N/A)
- Approved Qty: 18,000
- Target Date: 2024-12-22

**Item 7: LED-RED (2nd allocation)**
- Item Name: LED Red 5mm 20mA
- Customer: Open Pool
- Region: — (N/A)
- Approved Qty: 5,000
- Target Date: 2024-12-31

**Item 8: PRS-SNSAMEND**
- Item Name: Pressure Sensor 0-10 Bar
- Customer: ABC Electronics Ltd
- Region: Maharashtra
- Approved Qty: 6060
- Target Date: 2025-01-25

#### Amendment Table Summary
- **Summary Text:** "8 item(s) eligible · 0 selected"
- **Submit Button:** "Submit for Re-Approval (0)" - Disabled state

### Amendment Process Widget
- **Title:** Amendment Process
- **Step 1:** Select approved item lines from the table
- **Step 2:** Choose 'Amend Qty' or 'Cancel' for each
- **Step 3:** Enter new qty and mandatory reason
- **Step 4:** Submit — items re-enter Approval screen
- **Step 5:** Approver reviews and confirms the change

### Item Status Widget
- **Approved (eligible):** 7 items
- **Amend Pending:** 1 item

---

## FULFILLMENT MODULE

### Module Title
- **Main Title:** Fulfillment Tracker
- **Description:** Track OA allocation
- **Number of Lines:** 7 line(s)

### Key Metrics (Top Section)

#### Metric 1: Approved Lines
- **Label:** Approved Lines
- **Value:** 7
- **Sub-label:** active items

#### Metric 2: Approved Qty
- **Label:** Approved Qty
- **Value:** 38,725
- **Sub-label:** total units

#### Metric 3: Allocated (OA)
- **Label:** Allocated (OA)
- **Value:** 51,695
- **Sub-label:** 133% fill rate

#### Metric 4: Unallocated
- **Label:** Unallocated
- **Value:** -12,970
- **Sub-label:** -33% remaining

#### Metric 5: Order Acknowledgements
- **Label:** Order Acknowledgements
- **Value:** 15
- **Sub-label:** linked to items

### Filter & Search Section
- **Tab Buttons:**
  - **All** - View all fulfillment items
  - **Fulfilled** (Badge: 6) - Fully fulfilled items
  - **Partial** (Badge: 1) - Partially fulfilled items
  - **Open** (Badge: 0) - Not yet fulfilled

- **Search Field:** Searchable textbox
  - **Placeholder:** "Search item, customer..."

### Fulfillment Table Structure

#### Column Headers
1. **Item Code** - Item identifier
2. **Item Name** - Item description
3. **Customer** - Customer/Pool name
4. **Region** - Geographic region
5. **Appr. Qty** - Approved quantity
6. **Allocated** - Allocated/ordered quantity
7. **Fill Progress** - Fulfillment percentage
8. **Status** - Fulfillment status

#### Sample Fulfillment Items

**Item 1: PCB-001**
- Item Name: PCB Assembly Rev3
- Customer: ABC Electronics Ltd
- Region: Maharashtra
- Approved Qty: 480
- Allocated: 450
- Allocated Difference: -30
- Fill Progress: 94%
- Days to OD: 547d OD
- Status: Partial

**Item 2: RES-010K**
- Item Name: Resistor 10K Ω 1%
- Customer: ABC Electronics Ltd
- Region: Maharashtra
- Approved Qty: 10,000
- Allocated: 10,000
- Allocated Difference: 0
- Fill Progress: 100%
- Days to OD: 552d OD
- Status: Fulfilled

**Item 3: MOT-DC12**
- Item Name: DC Motor 12V 100RPM
- Customer: Delta Manufacturing Co
- Region: Tamil Nadu
- Approved Qty: 200
- Allocated: 200
- Allocated Difference: 0
- Fill Progress: 100%
- Days to OD: 542d OD
- Status: Fulfilled

**Item 4: PWR-24V**
- Item Name: Power Supply 24V 5A
- Customer: Delta Manufacturing Co
- Region: Tamil Nadu
- Approved Qty: 45
- Allocated: 45
- Allocated Difference: 0
- Fill Progress: 100%
- Days to OD: 544d OD
- Status: Fulfilled

**Item 5: IC-555**
- Item Name: IC Timer NE555P
- Customer: Open Pool
- Region: — (N/A)
- Approved Qty: 5,000
- Allocated: 5,000
- Allocated Difference: 0
- Fill Progress: 100%
- Days to OD: 537d OD
- Status: Fulfilled

**Item 6: LED-RED**
- Item Name: LED Red 5mm 20mA
- Customer: Open Pool
- Region: — (N/A)
- Approved Qty: 18,000
- Allocated: 18,000
- Allocated Difference: 0
- Fill Progress: 100%
- Days to OD: 540d OD
- Status: Fulfilled

**Item 7: LED-RED (2nd allocation)**
- Item Name: LED Red 5mm 20mA
- Customer: Open Pool
- Region: — (N/A)
- Approved Qty: 5,000
- Allocated: 18,000
- Allocated Difference: +13,000
- Fill Progress: 100%
- Days to OD: 531d OD
- Status: Fulfilled

### Fulfillment Summary (Bottom of Table)
- **Fulfilled Count:** 6 items
- **Partial Count:** 1 item
- **Open Count:** 0 items
- **Overall Fill Rate:** 133%
- **Unallocated:** -12,970 units

---

## DASHBOARD WIDGETS

### Right Sidebar Widgets (BIN Allocation Page)

#### Widget 1: Item Portfolio
- **Widget Title:** Item Portfolio
- **Metric 1:**
  - **Label:** Total Items
  - **Icon:** Chart icon
  - **Value:** 15

- **Metric 2:**
  - **Label:** Pending Approval
  - **Icon:** Clock icon
  - **Value:** 7

- **Metric 3:**
  - **Label:** Approved
  - **Icon:** Checkmark icon
  - **Value:** 7

- **Metric 4:**
  - **Label:** Amendment Pending
  - **Icon:** Refresh icon
  - **Value:** 1

#### Widget 2: Recent Item Entries
- **Widget Title:** Recent Item Entries
- **Display Type:** List of recent entries with status

**Entry 1:**
- Item Code: PRS-SNS
- Status: AMEND
- Customer: ABC Electronics Ltd
- Quantity: 60
- Target Date: 2025-01-25

**Entry 2:**
- Item Code: SOL-VLV
- Status: PENDING
- Customer: TechVision Ltd
- Quantity: 120
- Target Date: 2025-01-18

**Entry 3:**
- Item Code: PWR-24V
- Status: PENDING
- Customer: TechVision Ltd
- Quantity: 75
- Target Date: 2025-01-20

**Entry 4:**
- Item Code: LED-RED
- Status: APPROVED
- Customer: Open Pool
- Quantity: 5,000
- Target Date: 2024-12-31

**Entry 5:**
- Item Code: PCB-001
- Status: PENDING
- Customer: Open Pool
- Quantity: 200
- Target Date: 2025-01-15

**Entry 6:**
- Item Code: CAP-100U
- Status: PENDING
- Customer: Prism Corp
- Quantity: 3,000
- Target Date: 2025-01-10

**Entry 7:**
- Item Code: TRN-NPN
- Status: PENDING
- Customer: Prism Corp
- Quantity: 8,000
- Target Date: 2025-01-05

**Entry 8:**
- Item Code: REL-12V
- Status: PENDING
- Customer: Omega Systems Inc
- Quantity: 300
- Target Date: 2024-12-28

---

## STATUS INDICATORS

### Item Status Types
1. **APPROVED** - Item has been approved and locked
2. **PENDING** - Item awaiting approval
3. **AMEND** - Item has pending amendments
4. **AMENDMENT PENDING** - Amendment waiting for re-approval

### Fulfillment Status Types
1. **Fulfilled** - All approved quantity allocated
2. **Partial** - Some quantity allocated, remainder pending
3. **Open** - No allocation made yet

### Approval States
- **Approved** - Item approved with lock-in
- **Approved (in Approval Table)** - Shows as "Approved" status with lock
- **Pending Approval** - Item has "Approve" button available
- **Amend Pending** - Item in amendment workflow

---

## ITEM PORTFOLIO DATA

### Complete Item List

#### Product Categories Represented
1. **Resistors:**
   - RES-010K: Resistor 10K Ω 1%

2. **PCB/Circuit Boards:**
   - PCB-001: PCB Assembly Rev3

3. **Power Supply:**
   - PWR-24V: Power Supply 24V 5A

4. **Motors:**
   - MOT-DC12: DC Motor 12V 100RPM

5. **LEDs:**
   - LED-RED: LED Red 5mm 20mA

6. **ICs/Semiconductors:**
   - IC-555: IC Timer NE555P

7. **Relays:**
   - REL-12V: Relay 12V SPDT 10A

8. **Connectors:**
   - CON-DB9: DB9 Connector Male

9. **Capacitors:**
   - CAP-100U: Capacitor 100µF 50V

10. **Transistors:**
    - TRN-NPN: Transistor NPN BC547

11. **Solenoids:**
    - SOL-VLV: Solenoid Valve 24VDC

12. **Sensors:**
    - PRS-SNS: Pressure Sensor 0-10 Bar

### Customer List
1. ABC Electronics Ltd (Maharashtra)
2. Delta Manufacturing Co (Tamil Nadu)
3. TechVision Ltd (Delhi NCR)
4. Prism Corp (Gujarat)
5. Omega Systems Inc (Karnataka)
6. Open Pool (No specific region)

### Portal Summary Statistics
- **Total Items:** 15
- **Total Customers:** 5 (+ Open Pool)
- **Total Regions Covered:** 5
- **Pending Approvals:** 7
- **Approved Items:** 7
- **Amend Pending:** 1
- **Total Approved Quantity:** 38,725 units
- **Total Allocated Quantity:** 51,695 units
- **Fill Rate:** 133%
- **Order Acknowledgements:** 15

---

## KEY FEATURES SUMMARY

### BIN Allocation Module Features
✓ Create new allocations (Customer Specific or Open Pool)  
✓ Select from 15 regions  
✓ Add multiple item lines with dynamic updates  
✓ Target date selection per item  
✓ Submit for approval workflow  
✓ Real-time total quantity calculation  

### Approval Module Features
✓ Approve items in bulk or individually  
✓ Filter by approval status  
✓ Search items by code, customer, or region  
✓ Edit approval quantities per item  
✓ Sortable columns (Customer, BIN Qty, Target Date)  
✓ Lock items once approved  

### Amendment Module Features
✓ Select multiple items for amendment  
✓ Amend quantities or cancel items  
✓ Mandatory reason entry  
✓ Re-enter approval workflow  
✓ Track amendment process with 5-step guide  
✓ View item status breakdown  

### Fulfillment Module Features
✓ Track allocation fulfillment status  
✓ Monitor fill rates (with over-allocation capability)  
✓ View days to original delivery (OD)  
✓ Partial fulfillment tracking  
✓ Order acknowledgment linking  
✓ Filter by fulfillment status  
✓ Real-time metrics dashboard  

---

## WORKFLOW SUMMARY

### Standard Allocation Workflow
1. User creates BIN Allocation entry
2. Selects customer/region and adds items with quantities
3. Submits for Approval
4. Approver reviews in Approval module
5. Approver approves or modifies quantities
6. Item becomes locked and appears in Fulfillment
7. Orders acknowledged and tracked in Fulfillment module

### Amendment Workflow
1. User selects approved items for amendment
2. Chooses "Amend Qty" or "Cancel" action
3. Enters new quantity/reason (mandatory)
4. Submits for Re-Approval
5. Approver reviews amendment request
6. Approver confirms or rejects changes
7. Item status updated accordingly

---

## USER ROLES

### Current User Profile
- **Name:** Rajan Kumar
- **Role:** Sales Manager
- **Responsibilities:**
  - Create BIN allocations
  - Submit items for approval
  - Amend approved items as needed
  - Track fulfillment status

---

Build a modern, production-ready React portal layout using React.js, Tailwind CSS, and shadcn/ui components, No Next.js instead of use React-router-dom. The layout must be highly user-friendly and fully responsive across mobile, tablet, and desktop devices. 

Key Requirements:
1. DESKTOP LAYOUT (1024px and up):
- A fixed left sidebar (width 260px) for primary navigation. 
- The sidebar should include clean Lucide React icons with text labels, grouped into clear sections.
- At the bottom of the sidebar, include a user profile dropdown/trigger.
- A main content area that stretches fluidly across the remaining viewport space.

2. MOBILE & TABLET LAYOUT (Below 1024px):
- Fully hide the left sidebar automatically.
- Introduce a top navigation bar (Header) that contains a clean hamburger menu button on the left, a center-aligned minimal branding logo, and a user profile button on the right.
- Clicking the hamburger button must trigger an animated sheet / slide-out drawer from the left side containing the entire sidebar navigation panel. Clicking outside or selecting an option should smoothly close the sheet.

3. REUSABLE USER PORTIONS & LOOK:
- Style the interface using a modern glassmorphism or clean minimalist aesthetic: slate/zinc slate backgrounds, subtle gray borders, and crisp typography.
- Include a persistent top search bar (with a keyboard shortcut visual hint like '⌘K') and a dark/light mode toggle.
- Add micro-interactions: smooth transitions, hover states on menu items, and active state indicators to show which page is selected.

Provide a clean, interactive React component utilizing standard tailwind modifier classes (like `hidden lg:flex` and `lg:pl-64`) to handle the dynamic layout natively and responsively.

// ═══════════════════════════════════════════════════════
// Apply all three rules in a single pass strictly
// ═══════════════════════════════════════════════════════

// [R-01] SIZE LIMIT
// Refactor so every component file is STRICTLY under 100 lines.
// Extract sub-components, custom hooks, and helper functions.

// [R-02] FOLDER COLOCATION
// Group all related files into a FeatureName/ folder.
// Expose only index.tsx as the public entry point.
// Layout: index.tsx | SubComponent.tsx | hooks/ | utils/ | types.ts

// [R-03] READABILITY ORDER
// Structure every component in this exact order:
//   1. Types / Interfaces
//   2. Static constants (outside function)
//   3. Component signature
//   4. Hook calls (useState → useEffect → custom)
//   5. Derived / memoised values
//   6. Event handlers  (handleXxx)
//   7. Early returns   (loading | error | empty)
//   8. Single JSX return

// NAMING CONVENTIONS
// Props interface  → Props
// Event handlers   → handleXxx
// Boolean props    → isXxx | hasXxx | canXxx
// Custom hooks     → useXxx

// WHAT TO AVOID
// ✗ Inline arrow functions in JSX
// ✗ Ternaries deeper than 1 level
// ✗ Mixed logic and JSX in the same block
// ✗ Any file exceeding 100 lines

// Apply these rules to the component below and output
// the refactored files with their full folder structure.


LINK: https://chroma-blot-75920126.figma.site/

SELECT ORGANIZATION_ID,ORGANIZATION_CODE FROM ORG_ORGANIZATION_DEFINITIONS WHERE OPERATING_UNIT IN(103,704,844)
AND ORGANIZATION_ID IN(904,924,110,111,304,384,524,464,444,504,484,505,644,804,1025,724);



SELECT INVENTORY_ITEM_ID,SEGMENT1 FROM MTL_SYSTEM_ITEMS WHERE SEGMENT1='A23080160O' ;

SELECT JAN_SALES_RRS_CATEGORY(464,2307)RRS FROM DUAL;
