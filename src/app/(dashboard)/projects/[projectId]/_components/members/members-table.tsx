"use client";
import React from "react";
import { format } from "date-fns";
import {
	MoreHorizontal,
	ChevronDown,
	Search,
	UserPlus,
	Mail,
	Shield,
	ArrowUpDown,
} from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DeleteEntityDialog from "@/components/delete-entity-confirmation-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface Member {
	id: string;
	projectId: string;
	userId: string;
	roleId: string;
	joinedAt: Date | null;
	user: {
		id: string;
		name: string;
		email: string;
		emailVerified: boolean;
		image: string | null;
		createdAt: Date;
		updatedAt: Date;
	};
	project: any;
	role: {
		id: string;
		role: string;
		userId: string;
		projectId: string;
	};
}

interface MembersTableProps {
	members: Member[];
	onInviteMember?: () => void;
	onRemoveMember?: (id: string) => void;
	onChangeRole?: (id: string) => void;
}

const MembersTable: React.FC<MembersTableProps> = ({
	members,
	onInviteMember = () => {},
	onRemoveMember = () => {},
	onChangeRole = () => {},
}) => {
	const [sortBy, setSortBy] = React.useState<keyof Member>("joinedAt");
	const [sortOrder, setSortOrder] = React.useState("desc");
	const [search, setSearch] = React.useState("");
	const [roleFilter, setRoleFilter] = React.useState("all");

	const isMobile = useIsMobile();

	const filteredMembers = members
		?.filter(
			(member) =>
				(member.user.name?.toLowerCase().includes(search.toLowerCase()) ||
					member.user.email.toLowerCase().includes(search.toLowerCase())) &&
				(roleFilter === "all" || member.role.role === roleFilter)
		)
		.sort((a, b) => {
			const modifier = sortOrder === "desc" ? -1 : 1;
			return (
				modifier *
				(new Date(a[sortBy] as string).getTime() -
					new Date(b[sortBy] as string).getTime())
			);
		});

	interface HandleSortProps {
		field: keyof Member;
	}

	const handleSort = ({ field }: HandleSortProps) => {
		if (sortBy === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(field);
			setSortOrder("desc");
		}
	};

	return (
		<div className="space-y-4 mb-2">
			<div className="flex flex-col sm:flex-row justify-between gap-4">
				<div className="flex items-center gap-2 flex-1">
					<Search className="h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search members..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="max-w-xs"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="ml-2">
								Role <ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={() => setRoleFilter("all")}>
								All Roles
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setRoleFilter("admin")}>
								Admin
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setRoleFilter("member")}>
								Member
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Dialog>
					<DialogTrigger asChild>
						<Button size={isMobile ? "icon" : "default"}>
							<UserPlus className="h-4 w-4" /> {!isMobile && <>Invite Member</>}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Invite Project Member</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Input
									placeholder="Email address"
									type="email"
								/>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="w-full justify-between">
										Select Role <ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-full">
									<DropdownMenuItem>Admin</DropdownMenuItem>
									<DropdownMenuItem>Member</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
							<Button
								className="w-full"
								onClick={onInviteMember}>
								Send Invitation
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Member</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									onClick={() => handleSort({ field: "role" })}>
									Role <ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									onClick={() => handleSort({ field: "joinedAt" })}>
									Joined <ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
							<TableHead className="w-[100px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredMembers?.map((member) => (
							<TableRow key={member.id}>
								<TableCell>
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarImage src={member.user.image!} />
											<AvatarFallback>
												{member.user.name?.charAt(0) ||
													member.user.email.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-medium">{member.user.name}</div>
											<div className="text-sm text-muted-foreground">
												{member.user.email}
											</div>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Badge
										variant={
											member.role.role === "admin" ? "default" : "secondary"
										}>
										<Shield className="mr-1 h-3 w-3" />
										{member.role.role}
									</Badge>
								</TableCell>
								<TableCell>
									{member.joinedAt
										? format(new Date(member.joinedAt), "MMM d, yyyy")
										: "N/A"}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												className="h-8 w-8 p-0">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>View Details</DropdownMenuItem>
											<DropdownMenuItem onClick={() => onChangeRole(member.id)}>
												Change Role
											</DropdownMenuItem>
											<DeleteEntityDialog
												entityName={member.user.name}
												entityType="member"
												onDelete={() => onRemoveMember(member.id)}
												children={
													<DropdownMenuItem
														className="text-red-600"
														onClick={() => onRemoveMember(member.id)}>
														Remove Member
													</DropdownMenuItem>
												}
											/>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default MembersTable;
