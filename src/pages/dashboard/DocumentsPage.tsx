import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Trash2, Download, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function DocumentsPage() {
  const { user } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: number; type: string; url: string; path: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  async function fetchFiles() {
    setIsLoading(true);
    try {
      const { data: storageFiles, error } = await supabase.storage
        .from('patient-documents')
        .list(user?.id);

      if (error) throw error;

      if (storageFiles && storageFiles.length > 0) {
        // Create signed URLs for all files
        const fileData = await Promise.all(
          storageFiles.map(async (file) => {
            const path = `${user?.id}/${file.name}`;
            const { data } = await supabase.storage
              .from('patient-documents')
              .createSignedUrl(path, 3600);
            
            return {
              name: file.name.split('-').slice(1).join('-') || file.name,
              size: file.metadata?.size || 0,
              type: file.metadata?.mimetype || 'application/octet-stream',
              url: data?.signedUrl || '',
              path: path
            };
          })
        );
        setFiles(fileData);
      }
    } catch (e) {
      console.error('Error fetching documents:', e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || !user) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        // Sanitize filename to prevent special character issues
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const path = `${user.id}/${Date.now()}-${cleanName}`;
        const { data, error } = await supabase.storage.from('patient-documents').upload(path, file);
        if (!error && data) {
          const { data: urlData } = await supabase.storage.from('patient-documents').createSignedUrl(path, 3600);
          setFiles((prev) => [...prev, { 
            name: file.name, 
            size: file.size, 
            type: file.type, 
            url: urlData?.signedUrl ?? '',
            path: path
          }]);
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (path: string) => {
    const { error } = await supabase.storage.from('patient-documents').remove([path]);
    if (!error) {
      setFiles(prev => prev.filter(f => f.path !== path));
    }
  };

  const totalKB = files.reduce((acc, f) => acc + f.size / 1024, 0);
  const totalMB = totalKB / 1024;
  const maxMB = 200;

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">Medical Documents</h1>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-card p-10 text-center mb-6 transition-colors cursor-pointer ${dragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <Upload className="w-10 h-10 text-primary-400 mx-auto mb-3" />
        <p className="font-semibold text-dark mb-1">Drop files here or click to upload</p>
        <p className="text-sm text-gray-400">PDF, JPG, PNG — Max 20MB per file, 200MB total</p>
        {uploading && <p className="text-primary-500 text-sm mt-2 animate-pulse">Uploading...</p>}
      </div>

      {/* Storage Usage */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Storage Used</span>
          <span className="text-sm text-gray-500">{totalMB.toFixed(1)} MB of {maxMB} MB</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((totalMB / maxMB) * 100, 100)}%` }} />
        </div>
      </div>

      {/* Files List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FileText className="w-10 h-10 mx-auto mb-3" />
          <p>No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="card">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">File</th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Size</th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Type</th>
                <th className="py-2 px-3" />
              </tr>
            </thead>
            <tbody>
              {files.map((f, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium text-dark">{f.name}</td>
                  <td className="py-3 px-3 text-gray-500">{(f.size / 1024).toFixed(1)} KB</td>
                  <td className="py-3 px-3 text-gray-500">{f.type.split('/')[1]?.toUpperCase()}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2 justify-end">
                      <a href={f.url} target="_blank" rel="noreferrer" className="text-primary-500 hover:text-primary-700">
                        <Download className="w-4 h-4" />
                      </a>
                      <button onClick={() => deleteFile(f.path)} className="text-danger hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
