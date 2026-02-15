import { SafeImage } from '~/components/safe-image';

export function PreviewImage({
  previewImageUrl,
  title,
}: {
  previewImageUrl: string;
  title: string;
}) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <SafeImage
        src={previewImageUrl}
        alt={title}
        className="size-full object-cover"
        width={1920}
        height={1080}
        preload
      />
    </div>
  );
}
