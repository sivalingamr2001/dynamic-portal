using System;
using System.Collections.Generic;

namespace Application.Models;

public class OrganizationDto
{
    public int OrganizationId { get; set; }
    public string OrganizationCode { get; set; }
}

public class InventoryItemDto
{
    public int InventoryItemId { get; set; }
    public string ItemCode { get; set; }
}

public class AllocationHeaderDto
{
    public DateTime RequestDate { get; set; }
    public string AllocationBasis { get; set; }
    public int? CustomerId { get; set; }
    public int TerritoryId { get; set; }
    public string Remarks { get; set; }
    public int CreatedBy { get; set; }
}

public class AllocationLineDto
{
    public string LineId { get; set; } // Used for updates
    public string ItemCode { get; set; }
    public string WarehouseId { get; set; }
    public int RequestedQty { get; set; }
    public DateTime TargetDate { get; set; }
}

public class CreateAllocationRequest
{
    public AllocationHeaderDto Header { get; set; }
    public List<AllocationLineDto> Lines { get; set; } = new();
}

public class ApprovalRequest
{
    public string LineId { get; set; }
    public int ApproverId { get; set; }
    public int ApprovedQty { get; set; }
    public string Decision { get; set; } // "Approve", "Hold", "Reject"
    public string Remarks { get; set; }
}

public class RejectRequest
{
    public string LineId { get; set; }
    public string Reason { get; set; }
}

public class CancellationRequest
{
    public string LineId { get; set; }
    public int CancelledQty { get; set; }
    public string Reason { get; set; }
    public int CancelledBy { get; set; }
}