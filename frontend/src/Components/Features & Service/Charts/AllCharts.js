import DayCharts from "./DayCharts";
import MonthlyCharts from "./MonthlyCharts";
import YearlyData from "./YearlyData";
import PiChart from "./PiChart";
import MetaData from "../../Layouts/MetaData";
const AllCharts = () => {

  return (
    <>
      <MetaData title={"CHARTS"} />
      <section className="mt-14 lg:mt-20  lg:ml-72">
        <>
          <div>
            <div className="h-screen">
              <DayCharts />
              <div className="mb-8 p-4">
                <PiChart />
              </div>
              <MonthlyCharts />
              <YearlyData />
            </div>
          </div>
        </>
      </section>
    </>
  );
};

export default AllCharts;
