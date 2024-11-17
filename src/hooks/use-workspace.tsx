"use client";

import { Workspace } from "@/lib/db/schema.types";
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

interface WorkspaceContextProps {
	currentWorkspace: Workspace | null;
	setCurrentWorkspace: (workspace: Workspace) => void;
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(
	undefined
);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
	const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
		() => {
			if (typeof window !== "undefined") {
				const savedWorkspace = localStorage.getItem("currentWorkspace");
				return savedWorkspace ? JSON.parse(savedWorkspace) : null;
			}
			return null;
		}
	);

	useEffect(() => {
		if (typeof window !== "undefined") {
			if (currentWorkspace) {
				localStorage.setItem(
					"currentWorkspace",
					JSON.stringify(currentWorkspace)
				);
			} else {
				localStorage.removeItem("currentWorkspace");
			}
		}
	}, [currentWorkspace]);

	return (
		<WorkspaceContext.Provider
			value={{ currentWorkspace, setCurrentWorkspace }}>
			{children}
		</WorkspaceContext.Provider>
	);
};

export const useWorkspace = (): WorkspaceContextProps => {
	const context = useContext(WorkspaceContext);
	if (!context) {
		throw new Error("useWorkspace must be used inside a WorkspaceProvider");
	}
	return context;
};
