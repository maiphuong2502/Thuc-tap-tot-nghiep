<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AudioServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AudioController extends Controller
{
    protected $audioService;

    public function __construct(AudioServiceInterface $audioService)
    {
        $this->audioService = $audioService;
    }

    public function index(Request $request)
    {
        try {
            $search = $request->query('search');
            $audios = $this->audioService->getAudiosList($search);
            return response()->json([
                'success' => true,
                'data' => $audios
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách audio',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'audio_file' => 'required|file|mimes:mp3,wav,m4a|max:20480', // limit 20MB
            'transcript' => 'nullable|string'
        ]);

        try {
            $file = $request->file('audio_file');
            $originalName = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $file->getClientOriginalName());
            $fileName = time() . '_' . $originalName;
            $path = Storage::disk('public')->putFileAs('listening', $file, $fileName);
            $url = Storage::url($path);

            $data = [
                'audio_file' => $url,
                'transcript' => $request->input('transcript')
            ];

            $audio = $this->audioService->create($data);
            return response()->json([
                'success' => true,
                'data' => $audio,
                'message' => 'Upload audio thành công'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi upload audio: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'audio_file' => 'nullable|file|mimes:mp3,wav,m4a|max:20480',
            'transcript' => 'nullable|string'
        ]);

        try {
            $audio = $this->audioService->find($id);
            if (!$audio) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy audio'
                ], 404);
            }

            $data = ['transcript' => $request->input('transcript')];

            if ($request->hasFile('audio_file')) {
                // Delete old file if exists
                if ($audio->audio_file) {
                    $oldPath = str_replace('/storage/', '', $audio->audio_file);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }

                $file = $request->file('audio_file');
                $originalName = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $file->getClientOriginalName());
                $fileName = time() . '_' . $originalName;
                $path = Storage::disk('public')->putFileAs('listening', $file, $fileName);
                $data['audio_file'] = Storage::url($path);
            }

            $updatedAudio = $this->audioService->update($id, $data);
            return response()->json([
                'success' => true,
                'data' => $updatedAudio,
                'message' => 'Cập nhật audio thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật audio: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $audio = $this->audioService->find($id);
            if (!$audio) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy audio'
                ], 404);
            }

            // In actual app, check if audio is in use before deleting (e.g. by Questions)
            // Here we just delete the physical file and the record
            if ($audio->audio_file) {
                $oldPath = str_replace('/storage/', '', $audio->audio_file);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $this->audioService->delete($id);

            return response()->json([
                'success' => true,
                'message' => 'Xóa audio thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa audio: ' . $e->getMessage()
            ], 500);
        }
    }
}
