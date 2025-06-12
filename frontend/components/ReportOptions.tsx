import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import httpRequest from "@/util/httpRequest";

const REPORT_TYPES = [
  {
    key: "Spam",
    label: "Spam",
    desc: "Unwanted or repetitive content",
    icon: "report",
  },
  {
    key: "HateSpeech",
    label: "Hate Speech",
    desc: "Offensive or hateful language",
    icon: "report",
  },
  {
    key: "Violence",
    label: "Violence",
    desc: "Violent or graphic content",
    icon: "report",
  },
  {
    key: "InappropriateContent",
    label: "Inappropriate Content",
    desc: "Sexual, abusive, or otherwise inappropriate",
    icon: "report",
  },
  {
    key: "Misinformation",
    label: "Misinformation",
    desc: "False or misleading information",
    icon: "report",
  },
  {
    key: "WrongAnswer",
    label: "Wrong Answer",
    desc: "The answer provided is wrong",
    icon: "error",
  },
  {
    key: "OutOfContext",
    label: "Out of Context",
    desc: "Question is out of context",
    icon: "subject",
  },
  {
    key: "OutOfGrade",
    label: "Out of Grade",
    desc: "Not suitable for this grade",
    icon: "school",
  },
  { key: "Other", label: "Other", desc: "Other issue", icon: "report" },
];

type ReportOptionProps = {
  onClose?: () => void;
};

const ReportOption = ({ onClose }: ReportOptionProps) => {
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const reportedContent = useSelector(
    (state: RootState) => state.questions.reportedContent
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!selected || !reportedContent) return;
    setLoading(true);
    setError(null);
    try {
      console.log("Sending report for content:", {
        contentId: reportedContent,
        contentType: reportedContent,
        reportType: selected,
        report: selected,
      });
      await httpRequest(
        "/api/Report",
        {
          ContentType: reportedContent.contentType,
          ContentId: reportedContent.contentId,
          ReportType: selected,
        },
        "POST"
      );
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose && onClose();
      }, 1200);
    } catch (e) {
      setError("Failed to send report. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className={`w-full max-w-[340px] rounded-2xl py-4 z-10 shadow-2xl border ${
        currentTheme === "dark"
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-gray-200"
      }`}
      style={{ alignSelf: "center", maxHeight: 420 }}>
      <ScrollView
        style={{ maxHeight: 340 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}>
        <View className="items-center mb-4">
          <MaterialIcons
            name="report"
            size={32}
            color={currentTheme === "dark" ? "#fff" : "#000"}
          />
          <Text
            className={`text-xl font-psemibold mt-2 ${
              currentTheme === "dark" ? "text-white" : "text-gray-900"
            }`}>
            Report Content
          </Text>
          <Text
            className={`text-sm text-center mt-1 ${
              currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
            Help us understand what's wrong
          </Text>
        </View>
        {REPORT_TYPES.map((type) => (
          <TouchableOpacity
            key={type.key}
            className={`flex-row items-center px-6 py-4 active:opacity-70 rounded-lg mb-1 ${
              selected === type.key
                ? currentTheme === "dark"
                  ? "bg-indigo-900/40 border border-indigo-500"
                  : "bg-indigo-50 border border-indigo-500"
                : currentTheme === "dark"
                ? "border border-gray-800"
                : "border border-gray-200"
            }`}
            onPress={() => setSelected(type.key)}>
            <MaterialIcons
              name={type.icon as any}
              size={24}
              color={
                selected === type.key
                  ? "#6366F1"
                  : currentTheme === "dark"
                  ? "#fff"
                  : "#000"
              }
            />
            <View className="ml-4 flex-1">
              <Text
                className={`text-lg font-psemibold ${
                  currentTheme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                {type.label}
              </Text>
              <Text
                className={`text-sm font-pregular ${
                  currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                {type.desc}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {error && (
          <Text className="text-center text-red-500 mt-2">{error}</Text>
        )}
        {success && (
          <Text className="text-center text-green-500 mt-2">Report sent!</Text>
        )}
      </ScrollView>
      <TouchableOpacity
        className={`mt-4 mx-6 py-3 rounded-xl ${
          selected
            ? currentTheme === "dark"
              ? "bg-indigo-500"
              : "bg-indigo-600"
            : currentTheme === "dark"
            ? "bg-gray-800"
            : "bg-gray-200"
        } items-center`}
        onPress={handleSend}
        disabled={!selected || loading}>
        <Text
          className={`font-psemibold text-base ${
            selected ? "text-white" : "text-gray-400"
          }`}>
          {loading ? "Sending..." : "Send Report"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReportOption;
