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
        alt={title}
        className="size-full object-cover"
        height={1080}
        preload
        src={previewImageUrl}
        width={1920}
      />
    </div>
  );
}
