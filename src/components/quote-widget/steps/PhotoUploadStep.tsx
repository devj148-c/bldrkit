import { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface QuotePhoto {
  filename: string
  dataUrl: string
  size: number
}

interface PhotoUploadStepProps {
  photos: QuotePhoto[]
  onAddPhoto: (file: File) => Promise<void>
  onRemovePhoto: (index: number) => void
  onContinue: () => void
}

export function PhotoUploadStep({ photos, onAddPhoto, onRemovePhoto, onContinue }: PhotoUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return

    for (const file of Array.from(fileList)) {
      if (photos.length >= 5) break
      if (file.size > 10 * 1024 * 1024) continue
      await onAddPhoto(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Roof Photos (Optional)</CardTitle>
        <CardDescription>Photos help your roofer prepare a more accurate quote. Up to 5 photos, 10MB each.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="rounded-lg border border-dashed p-6 text-center"
          onDragOver={(event) => event.preventDefault()}
          onDrop={async (event) => {
            event.preventDefault()
            await handleFiles(event.dataTransfer.files)
          }}
        >
          <p className="text-sm text-muted-foreground mb-3">Drag and drop photos here or upload from your device</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            onChange={async (event) => handleFiles(event.target.files)}
          />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            Upload Photos
          </Button>
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo, index) => (
              <div key={`${photo.filename}-${index}`} className="rounded-md border p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.dataUrl} alt={photo.filename} className="h-20 w-full rounded object-cover" />
                <p className="mt-2 truncate text-xs">{photo.filename}</p>
                <Button type="button" variant="ghost" size="sm" className="mt-1 h-7 px-2 text-xs" onClick={() => onRemovePhoto(index)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button className="flex-1" onClick={onContinue}>Continue</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onContinue}>Skip</Button>
        </div>
      </CardContent>
    </Card>
  )
}
