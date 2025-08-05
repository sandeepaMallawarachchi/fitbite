import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from 'react-easy-crop';
import { getCroppedImg } from "../utils/cropImage";
import axios from "axios";
import { X } from "lucide-react";

type ProfilePictureUploaderProps = {
    onClose: () => void;
    onUploadSuccess: (url: string) => void;
    currentImage?: string;
    userId: string;
    token: string | null;
};

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({ onClose, onUploadSuccess }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result as string);
        reader.readAsDataURL(file);
    };


    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const uploadImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setIsUploading(true);

        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        const blob = await fetch(croppedImage).then((r) => r.blob());
        const formData = new FormData();
        formData.append("image", blob);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "https://fitbite-roan.vercel.app/user/upload-profile-pic",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            onUploadSuccess(res.data.imageUrl);
            onClose();
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/20 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md sm:max-w-[400px] w-full mx-5 sm:mx-0 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-2 right-2 text-gray-500 hover:text-black text-xl font-bold focus:outline-none"
                >
                    <X />
                </button>
                <h2 className="text-lg font-semibold mb-4 text-center">Upload Profile Picture</h2>
                {!imageSrc ? (
                    <label className="cursor-pointer flex justify-center">
                        <img
                            src="/profileupload.png"
                            alt="Upload"
                            className="w-40 h-40 object-contain hover:opacity-80 transition"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                ) : (
                    <>
                        <div className="relative w-full h-64 flex items-center justify-center">
                            <div className="relative w-64 h-64 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    style={{
                                        cropAreaStyle: {
                                            borderRadius: '50%',
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => setImageSrc(null)}
                                className="text-sm text-gray-600 hover:underline cursor-pointer"
                            >
                                Choose Another
                            </button>
                            <button
                                onClick={uploadImage}
                                className="bg-[#89E2AD] hover:bg-green-400 text-black font-semibold cursor-pointer px-4 py-2 rounded"
                                disabled={isUploading}
                            >
                                {isUploading ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProfilePictureUploader;