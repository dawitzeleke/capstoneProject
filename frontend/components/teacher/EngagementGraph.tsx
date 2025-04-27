import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const EngagementGraph = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
        strokeWidth: 2,
      },
    ],
  };

  return (
    <LineChart
      data={data}
      width={screenWidth - 40}
      height={220}
      yAxisLabel=""
      chartConfig={{
        backgroundColor: "#f1f3fc",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#d6ddff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`, // Indigo color
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      }}
      style={{
        borderRadius: 16,
      }}
    />
  );
};

export default EngagementGraph;
