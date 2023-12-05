import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

// eslint-disable-next-line react/prop-types
const GraphComponent = ({ data, xKey ,lineKey}) => {
  return (
    <>
      <LineChart
        width={500}
        height={250}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {/* <CartesianGrid strokeDasharray="3 3"/> */}
        <XAxis dataKey={xKey} />

        <YAxis
          label={{
            value: "Population",
            angle: -90,
            position: "right",
          }}
        />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={lineKey} stroke="#8884d8" />
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
      </LineChart>
    </>
  );
};

export default GraphComponent;
