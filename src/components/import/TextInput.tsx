interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TextInput = ({ value, onChange }: TextInputProps) => {
  const placeholderText = `Paste your group data here. Supports JSON and Markdown formats.

JSON example:
{
  "title": "My Group",
  "color": "blue",
  "tabs": [
    {"title": "Google", "url": "https://google.com"}
  ]
}

Alternative JSON format:
{
  "groupTitle": "My Group",
  "tabs": [
    {"title": "Google", "url": "https://google.com"}
  ]
}

Markdown example:
# My Group
- [Google](https://google.com)
- [GitHub](https://github.com)`;

  return (
    <div className="border border-material-border rounded-material-medium overflow-hidden">
      <textarea
        className="w-full p-3 bg-material-surface text-material-text-primary text-xs font-mono border-0 focus:outline-none resize-none scrollbar-custom"
        placeholder={placeholderText}
        style={{ lineHeight: "1.4" }}
        rows={18}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TextInput;
