import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Loader2, Save, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import type { AppConfig } from '../hooks/useConfig';

export default function SecretAdmin() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

  // Handlers for CMS actions
  const moveLeft = (index: number) => {
    if (!config || index === 0) return;
    const newPhotos = [...config.galleryPhotos];
    const temp = newPhotos[index - 1];
    newPhotos[index - 1] = newPhotos[index];
    newPhotos[index] = temp;
    setConfig({ ...config, galleryPhotos: newPhotos });
    setSaveStatus('idle'); // Needs saving
  };

  const moveRight = (index: number) => {
    if (!config || index === config.galleryPhotos.length - 1) return;
    const newPhotos = [...config.galleryPhotos];
    const temp = newPhotos[index + 1];
    newPhotos[index + 1] = newPhotos[index];
    newPhotos[index] = temp;
    setConfig({ ...config, galleryPhotos: newPhotos });
    setSaveStatus('idle');
  };

  const removePhoto = (index: number) => {
    if (!config) return;
    if (!confirm('정말 이 사진을 갤러리에서 제외하시겠습니까? (파일은 삭제되지 않습니다)')) return;
    const newPhotos = config.galleryPhotos.filter((_, i) => i !== index);
    setConfig({ ...config, galleryPhotos: newPhotos });
    setSaveStatus('idle');
  }

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
          <p className="mt-2 text-sm text-gray-500">메인 사진 관리 및 갤러리 설정</p>
        </div>

        {/* 상단: 변경사항 저장 버튼 */}
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
            {/* 섹션 1: 메인 사진 (Hero) 관리 */}
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <h3 className="text-xl font-bold text-gray-800 mb-2">메인 사진 (첫 화면)</h3>
                <p className="text-sm text-gray-500 mb-4">청첩장 첫 화면에 표시되는 메인 사진을 별도로 관리합니다.</p>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100 aspect-[4/5] relative">
                  <img src={config.mainPhoto} alt="Main Hero" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="w-full md:w-2/3 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <UploadSection 
                  title="메인 사진 업로드" 
                  onSuccess={(path) => {
                    setConfig({ ...config, mainPhoto: path });
                    setSaveStatus('idle');
                    alert('메인 사진이 변경되었습니다. 우측 상단의 [설정 저장 및 배포하기]를 눌러야 최종 반영됩니다.');
                  }} 
                />
              </div>
            </div>

            {/* 섹션 2: 갤러리 사진 관리 */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">갤러리 사진 관리</h3>
                  <p className="text-sm text-gray-500">사진 순서를 바꾸거나 갤러리에서 제외할 수 있습니다.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {config.galleryPhotos.map((photoUrl, idx) => (
                  <div key={idx} className="relative group border rounded-lg overflow-hidden flex flex-col border-gray-200">
                    <div className="h-32 bg-gray-100 relative">
                      <img src={photoUrl} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                      <button 
                        onClick={() => removePhoto(idx)}
                        className="absolute top-2 right-2 bg-white p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow"
                        title="제외하기"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="p-2 bg-gray-50 border-t flex justify-center gap-2">
                      <button onClick={() => moveLeft(idx)} disabled={idx === 0} className="p-1.5 bg-white border hover:bg-gray-100 rounded shadow-sm disabled:opacity-30">
                        <ArrowLeft className="w-4 h-4 text-gray-700" />
                      </button>
                      <button onClick={() => moveRight(idx)} disabled={idx === config.galleryPhotos.length - 1} className="p-1.5 bg-white border hover:bg-gray-100 rounded shadow-sm disabled:opacity-30">
                        <ArrowRight className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-8">
                <h4 className="text-md font-bold text-gray-800 mb-4 text-center">갤러리에 새 사진 추가하기</h4>
                <div className="max-w-md mx-auto">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                    <UploadSection 
                      title="갤러리 사진 업로드" 
                      onSuccess={(path) => {
                        setConfig({ ...config, galleryPhotos: [...config.galleryPhotos, path] });
                        setSaveStatus('idle');
                        alert('갤러리에 사진이 추가되었습니다. 순서를 조정한 후 [설정 저장 및 배포하기]를 눌러주세요.');
                      }} 
                    />
                  </div>
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

// Reusable Upload Component
function UploadSection({ title, onSuccess }: { title: string, onSuccess: (path: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const pureBase64 = base64Data.split(',')[1];

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, base64Content: pureBase64 }),
        });

        const data = await res.json();
        if (res.ok && data.path) {
          setStatus('idle');
          setFile(null);
          setPreview(null);
          onSuccess(data.path);
        } else {
          setStatus('error');
          setErrorMsg(data.error || '업로드 중 문제가 발생했습니다.');
        }
      };
    } catch (err) {
      setStatus('error');
      setErrorMsg('업로드 통신 에러');
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
          <input type="file" className="sr-only" accept="image/*" onChange={handleChange} />
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
