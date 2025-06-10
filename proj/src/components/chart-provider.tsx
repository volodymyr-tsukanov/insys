import React from 'react';
import Image from 'next/image';
import cat from '@/app/cat.gif'

type ChartProviderProps = {
    metrics: any | null;
    events: any | null;
    children: React.ReactNode;
};

const ChartProvider: React.FC<ChartProviderProps> = ({ metrics, events, children }) => {
    if (metrics == null || events == null) {
        return (
            <div className="grid grid-cols-4 grid-rows-2 gap-4 place-items-center p-4 max-w-2xl">
                <div className="row-span-2 col-span-1">
                    <Image
                        src={cat}
                        alt="cat"
                        height={200}
                        width={200}
                        className="rounded-lg"
                    />
                </div>
                <div className="col-span-3 text-lg font-semibold text-gray-600">
                    Nothing to show
                </div>
                <div className="col-span-3 text-base text-gray-500">
                    Firstly calculate metrics and get data
                </div>
            </div>
            )

    }
    return <>{children}</>;
};

export default ChartProvider;