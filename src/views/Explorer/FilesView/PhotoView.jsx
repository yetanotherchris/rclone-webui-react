import React, { useState, useEffect, useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';
import axiosInstance from "../../../utils/API/API";
import { toast } from "react-toastify";
import { getFilesList } from "rclone-api";
import { addColonAtLast } from "../../../utils/Tools";

// Photo/video extensions to filter
const PHOTO_VIDEO_EXTENSIONS = [
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'heic', 'heif',
    'mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v', '3gp', 'flv', 'wmv'
];

// Check if file is a photo or video
const isMediaFile = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return PHOTO_VIDEO_EXTENSIONS.includes(ext);
};

// Check if file is an image (not video)
const isImageFile = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'heic', 'heif'].includes(ext);
};

/**
 * PhotoView component - Google Photos-style photo browser
 * Displays photos and videos in a responsive grid with infinite scroll
 */
const PhotoView = ({ remoteName, remotePath, fsInfo, downloadHandle }) => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [thumbnailCache, setThumbnailCache] = useState({});

    /**
     * Recursively traverse directories to find all media files
     */
    const traverseAndFindMedia = useCallback(async (remName, remPath, depth = 0, maxDepth = 10) => {
        if (depth > maxDepth) return [];

        try {
            const response = await getFilesList(remName, remPath);
            const items = response.data.list || [];

            let allMedia = [];

            for (const item of items) {
                if (item.IsDir) {
                    // Recursively traverse subdirectories
                    const subMedia = await traverseAndFindMedia(remName, item.Path, depth + 1, maxDepth);
                    allMedia = [...allMedia, ...subMedia];
                } else if (item.Name && isMediaFile(item.Name)) {
                    // Add media file with metadata
                    allMedia.push({
                        ...item,
                        remoteName: remName,
                        remotePath: remPath,
                        fullPath: item.Path,
                        isImage: isImageFile(item.Name),
                        thumbnailUrl: null // Will be lazy loaded
                    });
                }
            }

            return allMedia;
        } catch (error) {
            console.error(`Error traversing ${remName}:${remPath}`, error);
            return [];
        }
    }, []);

    /**
     * Load all media files on mount or when path changes
     */
    useEffect(() => {
        const loadMediaFiles = async () => {
            if (!remoteName) {
                setMediaFiles([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const media = await traverseAndFindMedia(remoteName, remotePath || '');
                setMediaFiles(media);
                toast.success(`Found ${media.length} photos and videos`);
            } catch (error) {
                toast.error('Error loading media files');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadMediaFiles();
    }, [remoteName, remotePath, traverseAndFindMedia]);

    /**
     * Get thumbnail/preview URL for a media file
     */
    const getMediaUrl = useCallback((item) => {
        if (!item || !remoteName) return null;

        const { remoteName: itemRemoteName, Path } = item;
        const isBucketBased = fsInfo?.Features?.BucketBased;

        if (isBucketBased) {
            return `/[${itemRemoteName}]/${Path}`;
        } else {
            return `/[${addColonAtLast(itemRemoteName)}${Path}]`;
        }
    }, [remoteName, fsInfo]);

    /**
     * Handle media item click
     */
    const handleMediaClick = (item) => {
        setSelectedItem(item);
        // You can implement a lightbox/modal view here
        if (downloadHandle) {
            downloadHandle(item);
        }
    };

    /**
     * Close modal/lightbox
     */
    const closeViewer = () => {
        setSelectedItem(null);
    };

    /**
     * Render a single media item in the grid
     */
    const MediaItem = ({ item, style }) => {
        const [isLoaded, setIsLoaded] = useState(false);
        const [error, setError] = useState(false);
        const mediaUrl = getMediaUrl(item);

        return (
            <div
                style={style}
                className="photo-card group"
                onClick={() => handleMediaClick(item)}
            >
                {!isLoaded && !error && (
                    <div className="skeleton w-full h-full"></div>
                )}

                {item.isImage ? (
                    <img
                        src={mediaUrl}
                        alt={item.Name}
                        onLoad={() => setIsLoaded(true)}
                        onError={() => {
                            setError(true);
                            setIsLoaded(true);
                        }}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                            isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        loading="lazy"
                    />
                ) : (
                    <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
                        <video
                            src={mediaUrl}
                            className="w-full h-full object-cover"
                            onLoadedData={() => setIsLoaded(true)}
                            onError={() => {
                                setError(true);
                                setIsLoaded(true);
                            }}
                            muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                                className="w-16 h-16 text-white opacity-75"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Failed to load</span>
                    </div>
                )}

                {/* Overlay with filename on hover */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm truncate">{item.Name}</p>
                    {item.Size && (
                        <p className="text-gray-300 text-xs">
                            {(item.Size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    )}
                </div>
            </div>
        );
    };

    /**
     * Row renderer for Virtuoso - displays items in rows of 4
     */
    const Row = ({ index, style }) => {
        const itemsPerRow = 4;
        const startIdx = index * itemsPerRow;
        const rowItems = mediaFiles.slice(startIdx, startIdx + itemsPerRow);

        return (
            <div style={style} className="flex gap-1 px-2">
                {rowItems.map((item, idx) => (
                    <MediaItem
                        key={item.ID || `${item.Name}-${startIdx + idx}`}
                        item={item}
                        style={{ flex: 1, minHeight: '250px' }}
                    />
                ))}
                {/* Fill empty slots to maintain grid */}
                {rowItems.length < itemsPerRow &&
                    Array(itemsPerRow - rowItems.length).fill(0).map((_, idx) => (
                        <div key={`empty-${idx}`} style={{ flex: 1 }} />
                    ))
                }
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Scanning for photos and videos...</p>
                </div>
            </div>
        );
    }

    if (!remoteName) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No remote is selected. Select a remote to view photos.</p>
            </div>
        );
    }

    if (mediaFiles.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No photos or videos found in this location</p>
                </div>
            </div>
        );
    }

    const totalRows = Math.ceil(mediaFiles.length / 4);

    return (
        <div className="h-full w-full bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Photo Gallery
                    </h2>
                    <span className="text-sm text-gray-500">
                        {mediaFiles.length} items
                    </span>
                </div>
            </div>

            <Virtuoso
                totalCount={totalRows}
                itemContent={(index) => <Row index={index} />}
                style={{ height: 'calc(100% - 60px)' }}
                className="custom-scrollbar"
                overscan={200}
            />

            {/* Simple lightbox modal - can be enhanced */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={closeViewer}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
                        onClick={closeViewer}
                    >
                        ×
                    </button>
                    <div className="max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
                        {selectedItem.isImage ? (
                            <img
                                src={getMediaUrl(selectedItem)}
                                alt={selectedItem.Name}
                                className="max-w-full max-h-[90vh] object-contain"
                            />
                        ) : (
                            <video
                                src={getMediaUrl(selectedItem)}
                                controls
                                autoPlay
                                className="max-w-full max-h-[90vh]"
                            />
                        )}
                        <p className="text-white text-center mt-4">{selectedItem.Name}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoView;
