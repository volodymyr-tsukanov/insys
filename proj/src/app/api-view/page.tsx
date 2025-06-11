"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ApiViewer() {
    const [leftResponse, setLeftResponse] = useState<any>(null)
    const [rightResponse, setRightResponse] = useState<any>(null)
    const [leftLoading, setLeftLoading] = useState(false)
    const [rightLoading, setRightLoading] = useState(false)
    const [leftError, setLeftError] = useState<string | null>(null)
    const [rightError, setRightError] = useState<string | null>(null)

    const fetchLeftEndpoint = async () => {
        setLeftLoading(true)
        setLeftError(null)
        try {
            const response = await fetch("/api/calculate")
            const data = await response.json()
            setLeftResponse(data)
        } catch (error) {
            setLeftError("Failed to fetch data")
            console.error("Error fetching left endpoint:", error)
        } finally {
            setLeftLoading(false)
        }
    }

    const fetchRightEndpoint = async () => {
        setRightLoading(true)
        setRightError(null)
        try {
            const response = await fetch("/api/get?type=events")
            const data = await response.json()
            setRightResponse(data)
        } catch (error) {
            setRightError("Failed to fetch data")
            console.error("Error fetching right endpoint:", error)
        } finally {
            setRightLoading(false)
        }
    }

    const formatJson = (data: any) => {
        return JSON.stringify(data, null, 2)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">API Response Viewer</h1>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left Side - Posts API */}
                    <Card className="flex h-[600px] flex-col">
                        <CardHeader className="flex-shrink-0">
                            <CardTitle className="text-lg">Calculate endpoint</CardTitle>
                            <p className="text-sm text-gray-600">/api/calculate</p>
                            <Button onClick={fetchLeftEndpoint} disabled={leftLoading} className="w-full">
                                {leftLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Fetching...
                                    </>
                                ) : (
                                    "Fetch Data"
                                )}
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden">
                            <div className="h-full rounded-md border bg-gray-900 p-4">
                <pre className="h-full overflow-auto text-sm text-green-400">
                  <code>
                    {leftError ? (
                        <span className="text-red-400">{leftError}</span>
                    ) : leftResponse ? (
                        formatJson(leftResponse)
                    ) : (
                        <span className="text-gray-500">{'// Click "Fetch Data" to load JSON response'}</span>
                    )}
                  </code>
                </pre>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Side - Users API */}
                    <Card className="flex h-[600px] flex-col">
                        <CardHeader className="flex-shrink-0">
                            <CardTitle className="text-lg">Get Events Endpoint</CardTitle>
                            <p className="text-sm text-gray-600">/api/get?type=event</p>
                            <Button onClick={fetchRightEndpoint} disabled={rightLoading} className="w-full">
                                {rightLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Fetching...
                                    </>
                                ) : (
                                    "Fetch Data"
                                )}
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden">
                            <div className="h-full rounded-md border bg-gray-900 p-4">
                <pre className="h-full overflow-auto text-sm text-green-400">
                  <code>
                    {rightError ? (
                        <span className="text-red-400">{rightError}</span>
                    ) : rightResponse ? (
                        formatJson(rightResponse)
                    ) : (
                        <span className="text-gray-500">{'// Click "Fetch Data" to load JSON response'}</span>
                    )}
                  </code>
                </pre>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
