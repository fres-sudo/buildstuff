import PageContainer from "@/components/layout/page-container";
import { api } from "@/trpc/server";
import ProjectButtons from "./_components/project-buttons";
import {
  StatsCardOverview,
  StatsCardOverviewProps,
} from "@/components/stats-card-row";
import { Tornado } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectTasks from "./_components/tasks/projects-tasks";
import MembersTable from "./_components/members/members-table";

const ProjectPage = async ({
  params,
}: {
  params: {
    projectId: string;
  };
}) => {
  const { projectId } = params;
  const [project, stats] = await Promise.all([
    api.projects.get({
      projectId,
    }),
    api.projects.getProjectTasksStats({
      projectId,
    }),
  ]);

  const statsProps: StatsCardOverviewProps = [
    {
      title: "Total Tasks",
      content: stats.totalTasks.toFixed(2),
      icon: Tornado,
      label: "number of total tasks",
    },
    {
      title: "Total Tasks",
      content: stats.totalTasks.toFixed(2),
      icon: Tornado,
      label: "number of total tasks",
    },
    {
      title: "Total Tasks",
      content: stats.totalTasks.toFixed(2),
      icon: Tornado,
      label: "number of total tasks",
    },
    {
      title: "Total Tasks",
      content: stats.totalTasks.toFixed(2),
      icon: Tornado,
      label: "number of total tasks",
    },
  ];

  if (!project) {
    return <div>Project not found</div>;
  }
  return (
    <PageContainer>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight gap-2">
            <div>
              <span className="mr-2">{project.emoji || "🎯"}</span>
              {project.name.charAt(0).toUpperCase() + project.name.slice(1)}
              {project.labels.map((l) => (
                <div
                  key={l.label.id}
                  className={`rounded-full bg-${l.label.color}-500/30`}
                ></div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground font-thin">
              {project.code}
            </p>
          </h2>
          <ProjectButtons project={project} />
        </div>
        <StatsCardOverview props={statsProps} />
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="relative w-full justify-start h-auto bg-transparent ">
            <TabsTrigger
              value="tasks"
              className="px-4 py-2 text-gray-600  data-[state=active]:border-b-2 data-[state=active]:border-white-700 rounded-none bg-transparent"
            >
              Tasks
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="px-4 py-2 text-gray-600  data-[state=active]:border-b-2 data-[state=active]:border-white-700 rounded-none bg-transparent"
            >
              Members
            </TabsTrigger>
          </TabsList>
          <div className="w-full h-full flex flex-col border border-muted rounded-lg mt-2 mx-4 px-4 py-2">
            <TabsContent value="tasks">
              <ProjectTasks tasks={project.tasks} />
            </TabsContent>
            <TabsContent value="members">
              <MembersTable members={project.members} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default ProjectPage;
