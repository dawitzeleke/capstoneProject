import React, { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: boolean;
  submitted?: boolean;
  maxLength?: number;
}

const TagsInput = ({ 
  value, 
  onChange, 
  placeholder, 
  error, 
  submitted,
  maxLength = 20 
}: TagsInputProps) => {
  const [inputText, setInputText] = useState("");
  const [localError, setLocalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateTag = (tag: string) => {
    if (tag.length > maxLength) {
      triggerError(`Tag cannot exceed ${maxLength} characters`);
      return false;
    }
    return true;
  };

  const triggerError = (message: string) => {
    setLocalError(true);
    setErrorMessage(message);
    setInputText("");
    setTimeout(() => {
      setLocalError(false);
      setErrorMessage(null);
    }, 3000);
  };

  const handleInputChange = (text: string) => {
    if (localError) return;
    setInputText(text);

    if (RegExp(/[ ,\n]/).exec(text)) {
      const newTags = text
        .split(/[ ,\n]+/)
        .map((tag) => tag.trim())
        .filter((tag) => {
          if (tag === "") return false;
          return validateTag(tag) && !value.includes(tag);
        });

      if (newTags.length > 0) {
        onChange([...value, ...newTags]);
        setInputText("");
      }
    }
  };

  const handleSubmit = () => {
    const newTag = inputText.trim();
    if (newTag && validateTag(newTag) && !value.includes(newTag)) {
      onChange([...value, newTag]);
      setInputText("");
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <View className="bg-white rounded-xl shadow p-4 mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-psemibold text-slate-800">
          Tags<Text className="text-red-500 m-1 text-lg">*</Text>
        </Text>
        {submitted && error && (
          <Text className="text-red-500 text-xs">At least one tag required</Text>
        )}
      </View>

      <View className="flex-row items-center justify-between">
        <TextInput
          placeholder={"Use space/comma to separate tags"}
          placeholderTextColor="#94a3b8"
          className={`flex-1 border-b text-sm py-1  ${
            (submitted && error) || localError
              ? "border-red-200 bg-red-50 rounded" 
              : "border-slate-200 text-black font-pregular"
          }`}
          value={inputText}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSubmit}
          editable={!localError}
        />
      </View>

      {errorMessage && (
        <Text className="text-red-500 text-sm font-plight mt-2">
          {errorMessage}
        </Text>
      )}

      <View className="flex-row flex-wrap gap-2 mt-3">
        {value.map((tag, index) => (
          <View
            key={index}
            className="bg-indigo-100 px-3 py-1 rounded-full flex-row items-center"
          >
            <Text 
              className="text-indigo-700 font-pregular text-sm mr-1 max-w-[100px]" 
              numberOfLines={1} 
              ellipsizeMode="tail"
            >
              {tag}
            </Text>
            <Pressable onPress={() => removeTag(index)} className="ml-1">
              <Ionicons name="close-circle" size={14} color="#4F46E5" />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TagsInput;