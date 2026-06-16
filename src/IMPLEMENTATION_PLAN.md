# Implementation Plan: B3 BIN Portal (Sales)

This document outlines the end-to-end implementation plan for the BIN Allocation, Approval, and Cancellation modules. It addresses the requirement of storing a single header with multiple line items, processing approvals, and managing cancellations in dedicated tables.

---

## 1. Database Schema Design

Based on the requirements (Header, Lines, Approvals, Cancellations), we need a normalized database schema.

### A. `ALLOCATION_HEADERS` (Single Header)
Stores the primary request details.
- `HeaderId` (PK) - UUID / Auto-increment
- `RequestDate` - Date
- `AllocationBasis` - Enum (Customer Specific, Open Pool)
- `CustomerId` (Nullable) - FK to Customers
- `TerritoryId` - FK to Territories
- `Remarks` - Text
- `CreatedBy` - FK to Users (e.g., Sales Manager)
- `Status` - Enum (Pending, Approved, Partial, Cancelled)
- `CreatedAt` / `UpdatedAt` - Timestamps

### B. `ALLOCATION_LINES` (Multiple Items)
Stores individual items tied to a header.
- `LineId` (PK) - UUID / Auto-increment
- `HeaderId` (FK) - Refers to `ALLOCATION_HEADERS`
- `ItemCode` - String / FK to Items
- `WarehouseId` - String
- `RequestedQty` - Integer
- `ApprovedQty` - Integer (Defaults to 0 or null until approved)
- `TargetDate` - Date
- `Status` - Enum (Pending, Approved, Amend_Pending, Cancelled)
- `CreatedAt` / `UpdatedAt` - Timestamps

### C. `APPROVALS` (Approval History)
Maintains the audit and status of approval decisions.
- `ApprovalId` (PK)
- `LineId` (FK) - Refers to `ALLOCATION_LINES`
- `ApproverId` - FK to Users (HOD/Admin)
- `ApprovedQty` - Integer
- `Decision` - Enum (Approve, Hold, Cancel)
- `Remarks` - Text
- `ActionDate` - Timestamp

### D. `CANCELLATIONS` (Cancellation Tracking)
Maintains records of amended/cancelled quantities.
- `CancellationId` (PK)
- `LineId` (FK) - Refers to `ALLOCATION_LINES`
- `CancelledQty` - Integer
- `Reason` - Enum (Out of Stock, Customer Request, etc.)
- `Remarks` - Text
- `CancelledBy` - FK to Users
- `CancelDate` - Timestamp

---

## 2. Backend API Strategy

The backend APIs must ensure transactional integrity (ACID) when inserting the Header and Lines.

### Endpoints Required (per `portalConfig.ts`)

1. **Create Allocation (Header + Lines)**
   - **POST** `/v1/allocations`
   - **Payload**: `{ header: { requestDate, allocationBasis, territory... }, lines: [ { itemCode, requestedQty, targetDate... } ] }`
   - **Action**: DB Transaction -> Insert into `ALLOCATION_HEADERS`, get `HeaderId`, loop and insert into `ALLOCATION_LINES` with `HeaderId`.

2. **Process Approval**
   - **POST** `/v1/approvals`
   - **Payload**: `{ lineId, approvedQty, decision }`
   - **Action**: DB Transaction -> Insert into `APPROVALS`. Update `ALLOCATION_LINES.ApprovedQty` and `ALLOCATION_LINES.Status`.

3. **Process Cancellation / Amendment**
   - **POST** `/v1/cancellations`
   - **Payload**: `{ lineId, cancelledQty, reason }`
   - **Action**: DB Transaction -> Insert into `CANCELLATIONS`. Update `ALLOCATION_LINES.Status` (e.g., Cancelled or Amend Pending).

---

## 3. Frontend Implementation Plan (React)

### Tech Stack Assumptions
- **UI Library**: React (React Router for navigation)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Redux Toolkit (RTK Query) for API fetching and caching
- **Forms**: React Hook Form + Zod (for validation)

### Phase 1: BIN Allocation Module (Header + Lines Entry)
1. **State Setup**: Create a generic form state to hold 1 Header object and an Array of Line Item objects. Use `useFieldArray` from `react-hook-form` to manage dynamic item rows.
2. **UI Components**:
   - Header Section: Dropdowns for Region, Allocation Basis, Customer Search.
   - Items Table: Dynamic table with "Add Row", Item Code Search, Spinbutton for Qty, Datepicker for Target Date.
3. **Submission**: 
   - Validate all rows.
   - Map data to the `/v1/allocations` API payload format.
   - Use RTK Query mutation to submit. On success, navigate to "My Allocations" or clear the form and show a success toast.

### Phase 2: Approval Module
1. **Data Fetching**: Use RTK Query to fetch `/v1/allocations/lines?status=pending`.
2. **UI Components**:
   - Dashboard filter tabs (All, Pending, Approved).
   - Data Table (shadcn/ui `Table` or `@tanstack/react-table`).
   - Inline editing for `Approved Qty`.
3. **Submission**:
   - "Approve" button triggers `/v1/approvals` mutation.
   - Optimistically update the UI to remove the row from the "Pending" view and adjust the sidebar badge count.

### Phase 3: Amendment & Cancellation Module
1. **Data Fetching**: Fetch eligible approved items for amendment.
2. **UI Components**:
   - Checkbox table for selecting lines.
   - Modal/Drawer for entering `CancelledQuantity` and selecting a `Reason` (from config: `out_of_stock`, `customer_request`, etc.).
3. **Submission**:
   - Trigger `/v1/cancellations` mutation.
   - Move the item status back to the approval workflow if it's an amendment, or mark it completely cancelled.

---

## 4. Step-by-Step Execution Roadmap

### Step 1: Scaffold React Architecture
- Set up `/features/allocation`, `/features/approval`, `/features/cancellation` folder structures.
- Initialize Redux Toolkit store and `apiSlice.ts` using the `baseUrl` from `portalConfig.ts`.

### Step 2: Define Types & Interfaces
- Create `types/allocation.ts` based on `portalConfig.ts` configurations.
  ```typescript
  export interface AllocationHeaderPayload { ... }
  export interface AllocationLinePayload { ... }
  ```

### Step 3: Build the Allocation Form
- Create the `AllocationForm` component.
- Integrate `useFieldArray` for multiple items.
- Implement "Submit for Approval" logic.

### Step 4: Build the Approval Data Table
- Fetch data using RTK query `useGetPendingApprovalsQuery`.
- Implement table sorting and inline quantity editing.
- Implement bulk approval capability.

### Step 5: Build Cancellation Workflow
- Fetch approved lines.
- Build the cancellation dialog (enforcing mandatory reasons).
- Connect cancellation mutations.

---

## 5. Security & Best Practices
- **Transaction Integrity:** Ensure the backend never creates a Header without its accompanying Lines. 
- **Optimistic Updates:** Use RTK Query's `onQueryStarted` to instantly update the UI when approving or cancelling an item to make the portal feel lightning fast.
- **Form Validation:** Use Zod schemas on the frontend to strictly enforce required fields (Region, Item Code, Positive Quantities) before submitting to the backend.