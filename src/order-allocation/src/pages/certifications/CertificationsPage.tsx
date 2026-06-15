const WORKFLOW_STEPS = ["Select Vendor", "Add Items", "Preview", "Submit"];

function WorkflowProgressStub({ steps, currentStep }: { steps: string[]; currentStep: number }) {
    return (
        <div className="flex items-center gap-3">
            {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i < currentStep ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {i + 1}
                    </div>
                    <div className="text-sm text-muted-foreground hidden md:block">{s}</div>
                </div>
            ))}
        </div>
    )
}

export const CertificationsPage = () => {
    return (
        <div className="bg-sidebar min-h-[89.5vh] overflow-y-auto">
            <div className="mt-5 py-4 w-full flex justify-between border-b">
                <WorkflowProgressStub steps={WORKFLOW_STEPS} currentStep={1} />
            </div>

            <div></div>
        </div>
    );
}
