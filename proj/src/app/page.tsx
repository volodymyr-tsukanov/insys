'use client'

import {Button} from "@/components/ui/button";
import {SidebarTrigger} from "@/components/ui/sidebar";

import ComparisonPage from "@/components/charts/comparison-page";

export default function Home() {

    return (
        <>
            <section className="w-full flex justify-between">
                <div className="flex items-center gap-4">
                    <SidebarTrigger/>
                    <h2 className="text-xl">Lublin Cultural Metrics Panel</h2>
                </div>
            </section>
            <section className="w-full mt-5">
                <ComparisonPage/>
            </section>
        </>

    );
}
