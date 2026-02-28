import MediaFeed from '@/components/User/MediaFeed';

const AllMedia = () => {
    return (
        <div className="h-full w-full bg-black overflow-hidden relative">
            <MediaFeed type="all" />
        </div>
    );
};

export default AllMedia;