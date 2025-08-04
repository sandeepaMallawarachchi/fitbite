import ClientsTable from "../../components/ClientsTable"
import ClientStatsSidebar from "../../components/ClientStatsSidebar"

const CoachDashboard = () => {
    return (
        <div className="flex flex-col md:flex-row w-full justify-start gap-10 p-6">
            <ClientsTable />
            <ClientStatsSidebar />
        </div>

    )
}

export default CoachDashboard