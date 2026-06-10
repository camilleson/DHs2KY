import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, Loader2, Save, Trash2, Music, GripVertical } from 'lucide-react';
import clsx from 'clsx';
import type { AppConfig } from '../hooks/useConfig';

// ─── Default music options ───────────────────────────────────────────────────
const DEFAULT_MUSIC_OPTIONS = [
  { label: 'Dive (현재 기본 음악)', value: '/audio/background.mp3' },
];

// ─── Pointer-based Drag State ────────────────────────────────────────────────
interface DragState {
  fromIndex: number;
  toIndex: number;
}

export default function SecretAdmin() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Pointer-events drag state (replaces HTML5 drag + touch approach)
  const [dragState, setDragState] = useState<DragState | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const configRef = useRef<AppConfig | null>(null);
  configRef.current = config;

  // 1. Load config
  useEffect(() => {
    fetch('/data/config.json?' + Date.now())
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setIsLoadingConfig(false);
      })
      .catch(err => {
        console.error('Failed to load config:', err);
        setErrorMessage('설정을 불러오는 데 실패했습니다.');
        setIsLoadingConfig(false);
      });
  }, []);

  // ── Pointer drag handlers ─────────────────────────────────────────────────
  // Called only from the grip handle — prevents scroll+drag conflict
  const handleGripPointerDown = useCallback((e: React.PointerEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    // Capture pointer so we keep receiving move/up even outside the element
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragState({ fromIndex: index, toIndex: index });
  }, []);

  const handleGripPointerMove = useCallback((e: React.PointerEvent, _index: number) => {
    if (!dragState) return;
    e.preventDefault();
    // Find which card the pointer is currently over by checking bounding rects
    const { clientX, clientY } = e;
    for (let i = 0; i < cardRefs.current.length; i++) {
      const card = cardRefs.current[i];
      if (!card) continue;
      const rect = card.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right &&
          clientY >= rect.top && clientY <= rect.bottom) {
        if (i !== dragState.toIndex) {
          setDragState(prev => prev ? { ...prev, toIndex: i } : null);
        }
        break;
      }
    }
  }, [dragState]);

  const handleGripPointerUp = useCallback((_e: React.PointerEvent, _index: number) => {
    if (!dragState || !configRef.current) {
      setDragState(null);
      return;
    }
    const { fromIndex, toIndex } = dragState;
    if (fromIndex !== toIndex) {
      const newPhotos = [...configRef.current.galleryPhotos];
      const [moved] = newPhotos.splice(fromIndex, 1);
      newPhotos.splice(toIndex, 0, moved);
      setConfig({ ...configRef.current, galleryPhotos: newPhotos });
      setSaveStatus('idle');
    }
    setDragState(null);
  }, [dragState]);

  // ── Remove photo ──────────────────────────────────────────────────────────
  const removePhoto = (index: number) => {
    if (!config) return;
    if (!confirm('정말 이 사진을 갤러리에서 제외하시겠습니까? (파일은 삭제되지 않습니다)')) return;
    const newPhotos = config.galleryPhotos.filter((_, i) => i !== index);
    setConfig({ ...config, galleryPhotos: newPhotos });
    setSaveStatus('idle');
  };

  // ── Save config ───────────────────────────────────────────────────────────
  const handleSaveConfig = async () => {
    if (!config) return;
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newConfig: config })
      });
      if (res.ok) {
        setSaveStatus('success');
        alert('🎉 설정이 저장되었습니다! 약 1~2분 뒤 새로고침하면 반영됩니다.');
      } else {
        const data = await res.json();
        setSaveStatus('error');
        setErrorMessage(data.error || '저장 실패');
      }
    } catch (e) {
      setSaveStatus('error');
      setErrorMessage('서버와 통신할 수 없습니다.');
    }
  };

  if (isLoadingConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">

        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">청첩장 관리자</h2>
          <p className="mt-2 text-sm text-gray-500">메인 사진 · 갤러리 · 배경음악 관리</p>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveConfig}
            disabled={saveStatus === 'saving'}
            className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 shadow-lg text-white rounded-md font-bold transition-colors"
          >
            {saveStatus === 'saving' ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
            설정 저장 및 배포하기
          </button>
        </div>

        {saveStatus === 'error' && (
          <div className="mb-4 text-red-600 text-sm text-center">{errorMessage}</div>
        )}

        {config && (
          <>
            {/* ── 섹션 1: 메인 사진 ── */}
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <h3 className="text-xl font-bold text-gray-800 mb-2">메인 사진 (첫 화면)</h3>
                <p className="text-sm text-gray-500 mb-4">청첩장 첫 화면에 표시되는 메인 사진을 관리합니다.</p>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100 aspect-[4/5] relative">
                  <img src={config.mainPhoto} alt="Main Hero" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="w-full md:w-2/3 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <UploadSection
                  title="메인 사진 업로드"
                  accept="image/*"
                  onSuccess={(path) => {
                    setConfig({ ...config, mainPhoto: path });
                    setSaveStatus('idle');
                    alert('메인 사진이 변경되었습니다. [설정 저장 및 배포하기]를 눌러야 최종 반영됩니다.');
                  }}
                />
              </div>
            </div>

            {/* ── 섹션 2: 배경음악 ── */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Music className="w-6 h-6 text-indigo-500" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">배경음악 관리</h3>
                  <p className="text-sm text-gray-500">기본 음악을 선택하거나 새 음악 파일을 업로드하세요.</p>
                </div>
              </div>

              {/* 현재 음악 표시 */}
              <div className="mb-6 p-4 bg-indigo-50 rounded-lg flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-500 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/></svg>
                <span className="text-sm text-indigo-800 truncate">
                  현재 음악: <strong>{config.backgroundMusic || '/audio/background.mp3'}</strong>
                </span>
              </div>

              {/* 기본 음악 선택 */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">기본 제공 음악 선택</h4>
                <div className="space-y-2">
                  {DEFAULT_MUSIC_OPTIONS.map(opt => (
                    <label
                      key={opt.value}
                      className={clsx(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        config.backgroundMusic === opt.value
                          ? "border-indigo-400 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300"
                      )}
                    >
                      <input
                        type="radio"
                        name="music"
                        value={opt.value}
                        checked={config.backgroundMusic === opt.value}
                        onChange={() => {
                          setConfig({ ...config, backgroundMusic: opt.value });
                          setSaveStatus('idle');
                        }}
                        className="accent-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 사용자 지정 음악 선택 */}
              {(config.customBackgroundMusics && config.customBackgroundMusics.length > 0) && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">업로드된 사용자 지정 음악</h4>
                  <div className="space-y-2">
                    {config.customBackgroundMusics.map((opt, idx) => (
                      <div
                        key={opt.value}
                        className={clsx(
                          "flex items-center justify-between p-3 rounded-lg border transition-colors",
                          config.backgroundMusic === opt.value
                            ? "border-indigo-400 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300"
                        )}
                      >
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <input
                            type="radio"
                            name="music"
                            value={opt.value}
                            checked={config.backgroundMusic === opt.value}
                            onChange={() => {
                              setConfig({ ...config, backgroundMusic: opt.value });
                              setSaveStatus('idle');
                            }}
                            className="accent-indigo-500"
                          />
                          <span className="text-sm text-gray-700 truncate">{opt.label}</span>
                        </label>
                        <button
                          onClick={() => {
                            if (!confirm('이 음악을 리스트에서 삭제하시겠습니까?')) return;
                            const newMusics = [...config.customBackgroundMusics!];
                            newMusics.splice(idx, 1);
                            setConfig({
                              ...config,
                              customBackgroundMusics: newMusics,
                              backgroundMusic: config.backgroundMusic === opt.value ? DEFAULT_MUSIC_OPTIONS[0].value : config.backgroundMusic
                            });
                            setSaveStatus('idle');
                          }}
                          className="ml-2 p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="삭제하기"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 새 음악 업로드 */}
              <div className="border-t pt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">직접 음악 업로드 (MP3 / M4A / AAC)</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors">
                  <AudioUploadSection
                    onSuccess={(path, fileName) => {
                      const newMusics = config.customBackgroundMusics ? [...config.customBackgroundMusics] : [];
                      newMusics.push({ label: fileName, value: path });
                      setConfig({ ...config, backgroundMusic: path, customBackgroundMusics: newMusics });
                      setSaveStatus('idle');
                      alert('음악이 업로드되었습니다. [설정 저장 및 배포하기]를 눌러야 최종 반영됩니다.');
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── 섹션 2.5: 동영상 관리 ── */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">동영상 관리</h3>
                  <p className="text-sm text-gray-500">유튜브 영상을 연결하거나 짧은 동영상을 직접 업로드하세요.</p>
                </div>
              </div>

              {/* 현재 비디오 타입 설정 */}
              <div className="mb-6 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="videoType" 
                    value="youtube"
                    checked={config.videoType !== 'upload'} 
                    onChange={() => { setConfig({ ...config, videoType: 'youtube' }); setSaveStatus('idle'); }}
                    className="accent-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">유튜브 URL 사용 (기본)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="videoType" 
                    value="upload"
                    checked={config.videoType === 'upload'} 
                    onChange={() => { setConfig({ ...config, videoType: 'upload' }); setSaveStatus('idle'); }}
                    className="accent-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">직접 업로드</span>
                </label>
              </div>

              {/* 유튜브 URL 입력 */}
              {config.videoType !== 'upload' && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">유튜브 동영상 주소</label>
                  <input
                    type="text"
                    value={config.youtubeUrl || ''}
                    placeholder="https://www.youtube.com/watch?v=..."
                    onChange={(e) => {
                      setConfig({ ...config, youtubeUrl: e.target.value });
                      setSaveStatus('idle');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">입력하지 않으면 기본 웨딩 샘플 동영상이 보여집니다.</p>
                </div>
              )}

              {/* 직접 업로드 */}
              {config.videoType === 'upload' && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">현재 업로드된 영상: </span>
                      {config.uploadedVideoUrl ? (
                        <span className="text-sm text-blue-600 break-all">{config.uploadedVideoUrl}</span>
                      ) : (
                        <span className="text-sm text-gray-400">없음</span>
                      )}
                    </div>
                    {config.uploadedVideoUrl && (
                      <button
                        onClick={() => {
                          if (!confirm('업로드된 영상을 제거하시겠습니까? (목록에서만 제외됩니다)')) return;
                          setConfig({ ...config, uploadedVideoUrl: undefined });
                          setSaveStatus('idle');
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2 flex-shrink-0"
                        title="삭제하기"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-red-400 transition-colors bg-white">
                    <VideoUploadSection
                      onSuccess={(path) => {
                        setConfig({ ...config, uploadedVideoUrl: path });
                        setSaveStatus('idle');
                        alert('동영상이 업로드되었습니다. [설정 저장 및 배포하기]를 눌러야 최종 반영됩니다.');
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── 섹션 3: 갤러리 사진 관리 ── */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1">갤러리 사진 관리</h3>
                <p className="text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <GripVertical className="w-3.5 h-3.5" />
                    핸들을 누른 채 드래그하여 순서를 바꾸세요. ✕는 제외하기.
                  </span>
                </p>
              </div>

              {/* Gallery grid — pointer drag, no HTML5 drag */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 mt-4">
                {config.galleryPhotos.map((photoUrl, idx) => {
                  const isDragging = dragState?.fromIndex === idx;
                  const isDropTarget = dragState !== null &&
                    dragState.toIndex === idx &&
                    dragState.fromIndex !== idx;

                  return (
                    <div
                      key={photoUrl + idx}
                      ref={el => { cardRefs.current[idx] = el; }}
                      className={clsx(
                        "relative group border rounded-lg overflow-hidden flex flex-col transition-all duration-150 select-none",
                        isDragging && "opacity-50 scale-95 border-gray-300",
                        isDropTarget && "border-blue-400 ring-2 ring-blue-300",
                        !isDragging && !isDropTarget && "border-gray-200"
                      )}
                    >
                      {/* Index badge */}
                      <div className="absolute bottom-1 left-1 z-10 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">
                        {idx + 1}
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 z-10 bg-white p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow"
                        title="제외하기"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Photo */}
                      <div className="h-28 bg-gray-100 relative">
                        <img
                          src={photoUrl}
                          className="w-full h-full object-cover pointer-events-none"
                          alt={`Gallery ${idx + 1}`}
                          draggable={false}
                        />
                      </div>

                      {/* Grip handle — ONLY this element starts the drag */}
                      <div
                        className={clsx(
                          "flex items-center justify-center gap-1 py-2 bg-gray-50 border-t border-gray-100 text-gray-400 text-xs select-none",
                          dragState ? "cursor-grabbing" : "cursor-grab hover:bg-gray-100 hover:text-gray-600"
                        )}
                        style={{ touchAction: 'none', userSelect: 'none' }}
                        onPointerDown={(e) => handleGripPointerDown(e, idx)}
                        onPointerMove={(e) => handleGripPointerMove(e, idx)}
                        onPointerUp={(e) => handleGripPointerUp(e, idx)}
                        onPointerCancel={() => setDragState(null)}
                      >
                        <GripVertical className="w-4 h-4" />
                        <span className="text-[11px]">드래그</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 새 사진 추가 */}
              <div className="border-t pt-8">
                <h4 className="text-md font-bold text-gray-800 mb-4 text-center">갤러리에 새 사진 추가하기</h4>
                <div className="max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <UploadSection
                    title="갤러리 사진 업로드"
                    accept="image/*"
                    onSuccess={(path) => {
                      setConfig({ ...config, galleryPhotos: [...config.galleryPhotos, path] });
                      setSaveStatus('idle');
                      alert('사진이 추가되었습니다. 순서를 조정한 후 [설정 저장 및 배포하기]를 눌러주세요.');
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="text-center mt-4">
          <a href="/" className="text-sm font-medium text-gray-500 hover:text-gray-700">청첩장 홈으로 돌아가기</a>
        </div>
      </div>
    </div>
  );
}

// ─── Client-side image compression ───────────────────────────────────────────
function compressImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<{ base64: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
        } else {
          if (height > maxHeight) { width = Math.round((width * maxHeight) / height); height = maxHeight; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas context not available')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64 = dataUrl.split(',')[1];
        const originalName = file.name;
        const lastDotIdx = originalName.lastIndexOf('.');
        const nameWithoutExt = lastDotIdx !== -1 ? originalName.substring(0, lastDotIdx) : originalName;
        const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, '_');
        resolve({ base64, fileName: `${cleanName}.jpg` });
      };
      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// ─── Image Upload Section ─────────────────────────────────────────────────────
function UploadSection({ title, accept, onSuccess }: { title: string; accept: string; onSuccess: (path: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) { alert('이미지 파일만 업로드 가능합니다.'); return; }
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
      setStatus('idle');
      setErrorMsg('');
    }
  };

  const upload = async () => {
    if (!file) return;
    setStatus('uploading');
    try {
      const { base64, fileName } = await compressImage(file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, base64Content: base64, fileType: 'image' }),
      });
      const data = await res.json();
      if (res.ok && data.path) {
        setStatus('idle'); setFile(null); setPreview(null);
        onSuccess(data.path);
      } else {
        setStatus('error'); setErrorMsg(data.error || '업로드 중 문제가 발생했습니다.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('error'); setErrorMsg('업로드 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="space-y-2 text-center w-full">
        {preview ? (
          <img src={preview} alt="Preview" className="mx-auto h-32 object-cover rounded-md mb-4" />
        ) : (
          <ImageIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        )}
        <label className="relative cursor-pointer bg-blue-50 px-4 py-2 rounded-md font-medium text-blue-600 hover:bg-blue-100 transition-colors inline-block w-full">
          <span>{file ? '다른 사진 찾아보기' : '기기에서 사진 선택'}</span>
          <input type="file" className="sr-only" accept={accept} onChange={handleChange} />
        </label>
        {status === 'error' && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}
        <button
          onClick={upload}
          disabled={!file || status === 'uploading'}
          className={clsx(
            "w-full mt-3 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors",
            (!file || status === 'uploading') ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-black"
          )}
        >
          {status === 'uploading' ? <><Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> 서버로 전송 중...</> : title}
        </button>
      </div>
    </div>
  );
}

// ─── Audio Upload Section ─────────────────────────────────────────────────────
function AudioUploadSection({ onSuccess }: { onSuccess: (path: string, fileName: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const isAudio = selected.type.startsWith('audio/') || selected.name.toLowerCase().match(/\.(mp3|m4a|aac|wav)$/);
      if (!isAudio) { alert('오디오 파일만 업로드 가능합니다.'); return; }
      setFile(selected);
      setStatus('idle');
      setErrorMsg('');
    }
  };

  const upload = async () => {
    if (!file) return;
    setStatus('uploading');
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const base64 = base64Data.split(',')[1];
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, base64Content: base64, fileType: 'audio' }),
        });
        const data = await res.json();
        if (res.ok && data.path) {
          setStatus('idle'); setFile(null);
          onSuccess(data.path, file.name);
        } else {
          setStatus('error'); setErrorMsg(data.error || '업로드 중 문제가 발생했습니다.');
        }
      };
      reader.onerror = () => { setStatus('error'); setErrorMsg('파일 읽기 실패'); };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Audio upload error:', err);
      setStatus('error'); setErrorMsg('업로드 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="space-y-2 text-center w-full">
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        {file && <p className="text-sm text-gray-600 mb-2">🎵 {file.name}</p>}
        <label className="relative cursor-pointer bg-indigo-50 px-4 py-2 rounded-md font-medium text-indigo-600 hover:bg-indigo-100 transition-colors inline-block w-full">
          <span>{file ? '다른 음악 파일 선택' : '음악 파일 선택 (MP3 / M4A / AAC)'}</span>
          <input type="file" className="sr-only" accept="audio/*, .mp3, .m4a, .aac, .wav" onChange={handleChange} />
        </label>
        {status === 'error' && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}
        <button
          onClick={upload}
          disabled={!file || status === 'uploading'}
          className={clsx(
            "w-full mt-3 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors",
            (!file || status === 'uploading') ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-700 hover:bg-indigo-800"
          )}
        >
          {status === 'uploading' ? <><Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> 서버로 전송 중...</> : '배경음악 업로드'}
        </button>
      </div>
    </div>
  );
}

// ─── Video Upload Section ─────────────────────────────────────────────────────
function VideoUploadSection({ onSuccess }: { onSuccess: (path: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const isVideo = selected.type.startsWith('video/') || selected.name.toLowerCase().match(/\.(mp4|mov|webm|mkv)$/);
      if (!isVideo) { alert('동영상 파일만 업로드 가능합니다.'); return; }
      setFile(selected);
      setStatus('idle');
      setErrorMsg('');
    }
  };

  const upload = async () => {
    if (!file) return;
    setStatus('uploading');
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const base64 = base64Data.split(',')[1];
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, base64Content: base64, fileType: 'video' }),
        });
        const data = await res.json();
        if (res.ok && data.path) {
          setStatus('idle'); setFile(null);
          onSuccess(data.path);
        } else {
          setStatus('error'); setErrorMsg(data.error || '업로드 중 문제가 발생했습니다.');
        }
      };
      reader.onerror = () => { setStatus('error'); setErrorMsg('파일 읽기 실패'); };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Video upload error:', err);
      setStatus('error'); setErrorMsg('업로드 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="space-y-2 text-center w-full">
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        {file && <p className="text-sm text-gray-600 mb-2">🎬 {file.name}</p>}
        <label className="relative cursor-pointer bg-red-50 px-4 py-2 rounded-md font-medium text-red-600 hover:bg-red-100 transition-colors inline-block w-full">
          <span>{file ? '다른 동영상 선택' : '동영상 파일 선택 (10MB 이하 권장)'}</span>
          <input type="file" className="sr-only" accept="video/*, .mp4, .mov, .webm, .mkv" onChange={handleChange} />
        </label>
        {status === 'error' && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}
        <button
          onClick={upload}
          disabled={!file || status === 'uploading'}
          className={clsx(
            "w-full mt-3 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors",
            (!file || status === 'uploading') ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
          )}
        >
          {status === 'uploading' ? <><Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> 서버로 전송 중...</> : '동영상 업로드'}
        </button>
      </div>
    </div>
  );
}
