import { WorkflowProgress } from "@/components/certifications/WorkflowProgress";

const WORKFLOW_STEPS = ['Select Vendor', 'Add Items', 'Preview', 'Submit'];

export const CertificationsPage = () => {
    const currentStep = WORKFLOW_STEPS[0];
    return (
        <div className="bg-sidebar min-h-[89.5vh] overflow-y-auto">
            <div className="mt-5 py-4 w-full flex justify-between border-b">
                <WorkflowProgress steps={WORKFLOW_STEPS} currentStep={1} />
            </div>

            <div>
                
            </div>
        </div>
    );
}
