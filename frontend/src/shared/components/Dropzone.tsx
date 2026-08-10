import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface DropzoneProps {
    files: File[];
    onChange: (files: File[]) => void;
    maxFiles?: number;
    accept?: string;
    disabled?: boolean;
}

export function Dropzone({ files, onChange, maxFiles = 8, accept = "image/jpeg,image/png,image/webp", disabled }: DropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const addFiles = (incoming: FileList | null) => {
        if (!incoming) return;
        const combined = [...files, ...Array.from(incoming)].slice(0, maxFiles);
        onChange(combined);
    };

    const removeFile = (index: number) => {
        onChange(files.filter((_, i) => i !== index));
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        addFiles(event.dataTransfer.files);
    };

    return (
        <div className="space-y-3">
            <div
                onClick={() => !disabled && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground transition",
                    isDragging && "border-primary bg-primary/5",
                    disabled && "cursor-not-allowed opacity-50"
                )}
            >
                <ImagePlus className="size-6" />
                <span>Drag images here, or click to browse</span>
                <span className="text-xs">Up to {maxFiles} images — JPG, PNG, or WEBP</span>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={accept}
                    className="hidden"
                    disabled={disabled}
                    onChange={(e) => addFiles(e.target.files)}
                />
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                    {files.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="group relative aspect-square overflow-hidden rounded-md border">
                            <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                                aria-label={`Remove ${file.name}`}
                            >
                                <X className="size-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
