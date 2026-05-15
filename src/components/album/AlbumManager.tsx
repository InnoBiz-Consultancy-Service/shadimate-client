"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Camera,
  Trash2,
  Pencil,
  X,
  Check,
  Loader2,
  Plus,
  ImageIcon,
} from "lucide-react";
import { useAlbum } from "@/hooks/useAlbum";
import type { AlbumPhoto } from "@/actions/album/album";

/* ── Photo Card ── */
function PhotoCard({
  photo,
  onDelete,
  onEdit,
}: {
  photo: AlbumPhoto;
  onDelete: (id: string) => void;
  onEdit: (id: string, caption: string) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [caption, setCaption] = useState(photo.caption || "");
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(photo._id);
    setDeleting(false);
  };

  const handleSaveCaption = async () => {
    setSaving(true);
    await onEdit(photo._id, caption);
    setSaving(false);
    setEditMode(false);
  };

  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
      {photo.url ? (
        <Image
          src={photo.url}
          alt={photo.caption || "Album photo"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 33vw, 200px"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <ImageIcon size={28} className="text-gray-400" />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 z-10" />

      {/* Caption overlay at bottom */}
      {photo.caption && !editMode && (
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent px-2 py-1.5 z-20">
          <p className="text-white text-[10px] font-outfit truncate">
            {photo.caption}
          </p>
        </div>
      )}

      {/* Action buttons */}
      {!editMode && (
        <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-30">
          <button
            onClick={() => setEditMode(true)}
            className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center shadow active:scale-95 transition-transform"
            title="Edit caption"
          >
            <Pencil size={12} className="text-gray-700" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-7 h-7 rounded-lg bg-red-500/90 flex items-center justify-center shadow active:scale-95 transition-transform disabled:opacity-60"
            title="Delete photo"
          >
            {deleting ? (
              <Loader2 size={12} className="text-white animate-spin" />
            ) : (
              <Trash2 size={12} className="text-white" />
            )}
          </button>
        </div>
      )}

      {/* Edit caption panel */}
      {editMode && (
        <div
          className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 p-2 z-30"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption..."
            maxLength={80}
            className="w-full px-2 py-1.5 rounded-lg bg-white/90 text-gray-800 text-xs font-outfit focus:outline-none focus:ring-2 focus:ring-brand/50"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveCaption}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-brand text-white text-xs font-outfit font-medium active:scale-95 transition-transform disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Check size={11} />
              )}
              Save
            </button>
            <button
              onClick={() => {
                setCaption(photo.caption || "");
                setEditMode(false);
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/20 text-white text-xs font-outfit active:scale-95 transition-transform"
            >
              <X size={11} />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Upload Slot ── */
function UploadSlot({
  onFileSelected,
  uploading,
  progress,
}: {
  onFileSelected: (file: File) => void;
  uploading: boolean;
  progress: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = "";
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !uploading && inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95
        ${uploading ? "border-brand/40 bg-brand/5 cursor-wait" : "border-gray-200 hover:border-brand/40 hover:bg-brand/5"}`}
    >
      {uploading ? (
        <>
          <Loader2 size={22} className="text-brand animate-spin" />
          <span className="font-outfit text-[11px] text-brand font-medium">
            {progress}%
          </span>
        </>
      ) : (
        <>
          <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
            <Plus size={16} className="text-brand" />
          </div>
          <span className="font-outfit text-[10px] text-gray-400 text-center px-1">
            Add Photo
          </span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
        disabled={uploading}
      />
    </div>
  );
}

/* ── Main AlbumManager ── */
interface AlbumManagerProps {
  initialPhotos: AlbumPhoto[];
}

export default function AlbumManager({ initialPhotos }: AlbumManagerProps) {
  const {
    photos,
    uploading,
    uploadProgress,
    error,
    uploadAndAddPhoto,
    editPhoto,
    removePhoto,
    clearError,
  } = useAlbum(initialPhotos);

  const [captionInput, setCaptionInput] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showCaptionModal, setShowCaptionModal] = useState(false);

  const handleFileSelected = (file: File) => {
    setPendingFile(file);
    setCaptionInput("");
    setShowCaptionModal(true);
  };

  const handleUpload = async () => {
    if (!pendingFile) return;
    setShowCaptionModal(false);
    await uploadAndAddPhoto(pendingFile, captionInput || undefined);
    setPendingFile(null);
    setCaptionInput("");
  };

  const handleSkipCaption = async () => {
    if (!pendingFile) return;
    setShowCaptionModal(false);
    await uploadAndAddPhoto(pendingFile);
    setPendingFile(null);
  };

  const showUploadSlot = photos.length < 10;

  return (
    <div>
      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-3 text-xs text-red-600 font-outfit">
          <span>{error}</span>
          <button onClick={clearError}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Photo count */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-outfit text-xs text-gray-400">
          {photos.length}/10 photos
        </span>
        {photos.length === 10 && (
          <span className="font-outfit text-[10px] text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
            Album full
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <PhotoCard
            key={photo._id}
            photo={photo}
            onDelete={removePhoto}
            onEdit={(id, caption) => editPhoto(id, { caption })}
          />
        ))}

        {showUploadSlot && (
          <UploadSlot
            onFileSelected={handleFileSelected}
            uploading={uploading}
            progress={uploadProgress}
          />
        )}
      </div>

      {photos.length === 0 && !uploading && (
        <div className="text-center py-4 mt-2">
          <Camera size={28} className="text-brand/30 mx-auto mb-2" />
          <p className="font-outfit text-gray-400 text-sm">
            No photos yet. Add your first photo!
          </p>
        </div>
      )}

      {/* Caption Modal */}
      {showCaptionModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 px-4"
          onClick={() => setShowCaptionModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-syne text-gray-800 font-bold text-base mb-1">
              Add a caption?
            </h3>
            <p className="font-outfit text-gray-400 text-xs mb-4">
              Optional — describe this photo
            </p>
            <input
              type="text"
              value={captionInput}
              onChange={(e) => setCaptionInput(e.target.value)}
              placeholder="e.g. My graduation day..."
              maxLength={80}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-outfit text-gray-700 focus:outline-none focus:border-brand/50 mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-brand to-accent text-white font-outfit font-semibold text-sm active:scale-95 transition-transform"
              >
                Upload
              </button>
              <button
                onClick={handleSkipCaption}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-outfit text-sm active:scale-95 transition-transform"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
