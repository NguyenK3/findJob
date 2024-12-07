import CompanyDetail from "@/components/components/company/app.client.companyDetail"

const CompanyIdDetailPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const id = (await params).id
    return (
        <>
            <CompanyDetail id={id} />
        </>
    )
}

export default CompanyIdDetailPage