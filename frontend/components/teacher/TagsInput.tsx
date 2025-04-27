import React, { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: boolean;
  maxLength?: number;
}

const TagsInput = ({ 
  value, 
  onChange, 
  placeholder, 
  error, 
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
    setInputText(""); // Reset input field when error occurs
    setTimeout(() => {
      setLocalError(false);
      setErrorMessage(null);
    }, 3000);
  };

  const handleInputChange = (text: string) => {
    if (localError) {
      // If already in error state, block typing temporarily
      return;
    }
    setInputText(text);

    // Check for separators (space, comma, enter)
    if (RegExp(/[ ,\n]/).exec(text)) {
      const newTags = text
        .split(/[ ,\n]+/)
        .map((tag) => tag.trim())
        .filter((tag) => {
          if (tag === "") return false;
          const isValid = validateTag(tag) && !value.includes(tag);
          return isValid;
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
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  return (
    <View className="bg-white rounded-xl shadow p-4 mb-6">
      <Text className="text-base font-psemibold text-slate-800 mb-2">
        Tags<Text className="text-red-500">*</Text>
      </Text>

      <View className="flex-row items-center justify-between">
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          className={`flex-1 border-b text-sm py-1 ${
            (error || localError) 
              ? "border-red-500 bg-red-100 text-red-600 rounded" 
              : "border-slate-200 text-slate-700"
          }`}
          value={inputText}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSubmit}
          editable={!localError} // temporarily disable input when error
        />
      </View>

      {errorMessage && (
        <Text className="text-red-500 text-xs mt-2">
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
              className="text-indigo-700 text-xs mr-1 max-w-[100px]" 
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
