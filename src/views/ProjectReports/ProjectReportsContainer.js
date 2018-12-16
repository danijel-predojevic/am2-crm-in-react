import React, { Component } from 'react';
import moment from 'moment';
import randomColor from 'randomcolor';
import ProjectReports from './ProjectReports';
import Filters from './components/Filters';
import MiniChart from './components/MiniChart';
import UserPerDateChart from './components/UserPerDateChart';
import Loading from '../../components/General/Loading';
import WP_API from '../../data/Api';

class ProjectReportsContainer extends Component {
    constructor() {
        super();
        this.state = {
            projectReports: [],
            totalRecords: 0,
            loading: false,
            empty: false,
            projectsList: [],
            filterDate: {
                start: moment(
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    'YYYY-MM-DD'
                ),
                end: moment(
                    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
                    'YYYY-MM-DD'
                )
            },
            filterProject: '',
            filterDepartment: '',
            filterJobType: '',
            barChartData: [],
            chartOptions: {
                legend: {
                    position: 'right'
                },
                tooltips: {
                    intersect: false
                }
            }
        };
    }

    componentWillMount() {
        const api = new WP_API();
        api.getPosts('projects').then(result =>
            this.setState({
                projectsList: result.data
            })
        );
    }

    generateRandomColors = length =>
        Array(length)
            .fill()
            .map((_, i) => randomColor({ luminosity: 'bright' }));

    getData = () => {
        this.setState({ loading: true });
        const { filterProject, filterDepartment, filterJobType, filterDate } = this.state;
        const byPassCache = true;
        const byPassCacheSave = true;
        const api = new WP_API();
        const projectReports = api
            .getPosts(
                'project-reports',
                {
                    itemsPerPage: 20000,
                    filterProject,
                    filterDepartment,
                    filterJobType,
                    filterDate
                },
                byPassCache,
                byPassCacheSave
            )
            .then(result => {
                const posts = result.data
                    ? result.data.map(post => ({
                          id: post.id,
                          billable_hours: post.billable_hours,
                          month: post.month,
                          user: post.user,
                          project: post.project,
                          milestones: post.milestones,
                          milestone: post.milestone,
                          project_feature: post.project_feature,
                          date: post.date,
                          // hours: post.hours,
                          job_type: post.job_type,
                          comment: post.comment,
                          asana_url: post.asana_url
                      }))
                    : false;
                return posts
                    ? {
                          posts,
                          totalRecords: result.data ? result.data.count : 0,
                          totalHours: result.report.data.totals.hours,
                          userData: {
                              labels: result.report.data.totals.users.labels,
                              datasets: [
                                  {
                                      data: result.report.data.totals.users.hours,
                                      backgroundColor: this.generateRandomColors(
                                          result.report.data.totals.users.hours.length
                                      )
                                  }
                              ]
                          },
                          jobTypeData: {
                              labels: result.report.data.totals.job_type.labels,
                              datasets: [
                                  {
                                      data: result.report.data.totals.job_type.hours,
                                      backgroundColor: this.generateRandomColors(
                                          result.report.data.totals.job_type.hours.length
                                      )
                                  }
                              ]
                          },
                          milestoneData: {
                              labels: result.report.data.totals.milestones.labels,
                              datasets: [
                                  {
                                      data: result.report.data.totals.milestones.hours,
                                      backgroundColor: this.generateRandomColors(
                                          result.report.data.totals.milestones.hours.length
                                      )
                                  }
                              ]
                          },
                          barChartData: Object.values(result.report.data.totals.users.dates)
                      }
                    : false;
            });

        Promise.all([projectReports]).then(values => {
            this.setState({
                projectReports: values[0].posts ? values[0].posts : [],
                totalRecords: values[0].totalRecords,
                totalHours: values[0].totalHours,
                userData: values[0].userData,
                jobTypeData: values[0].jobTypeData,
                milestoneData: values[0].milestoneData,
                loading: false,
                barChartData: values[0].barChartData
                    ? values[0].barChartData.map(bar => ({
                          ...bar,
                          backgroundColor: randomColor({ luminosity: 'bright' })
                      }))
                    : [],
                empty: values[0].totalRecords === 0
            });
        });
    };

    filterChangeEvent = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value, loading: true }, () => {
            this.getData();
        });
    };

    render() {
        const {
            projectReports,
            totalHours,
            totalRecords,
            loading,
            filterProject,
            filterDepartment,
            filterJobType,
            empty,
            projectsList,
            chartOptions,
            userData,
            jobTypeData,
            milestoneData,
            barChartData
        } = this.state;
        const columns = [
            { key: 'month', title: 'Month' },
            { key: 'user', title: 'User' },
            { key: 'billable_hours', title: 'Billable Hours' },
            { key: 'date', title: 'Date' },
            { key: 'project', title: 'Project' },
            { key: 'milestone', title: 'Milestone' },
            // { key: 'project_feature', title: 'Feature' },
            { key: 'job_type', title: 'Job Type' },
            { key: 'comment', title: 'Comment' },
            { key: 'asana_url', title: 'Asana URL' }
        ];

        if (loading) {
            return <Loading />;
        }

        return (
            <React.Fragment>
                <Filters
                    projectsList={projectsList}
                    filterChangeEvent={this.filterChangeEvent}
                    filterProject={filterProject}
                    filterDepartment={filterDepartment}
                    filterJobType={filterJobType}
                />
                {userData ? (
                    <div className="section__content section__minicharts">
                        <div className="miniChartContainer">
                            <MiniChart
                                data={userData}
                                title="Total Hours per User"
                                totalHours={totalHours}
                                options={chartOptions}
                            />
                            <MiniChart
                                data={jobTypeData}
                                title="Total Hours per Job Type"
                                totalHours={totalHours}
                                options={chartOptions}
                            />
                            <MiniChart
                                data={milestoneData}
                                title="Total Hours per Milestone"
                                totalHours={totalHours}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                ) : (
                    ''
                )}
                {barChartData.length ? <UserPerDateChart data={barChartData} /> : ''}
                <ProjectReports
                    columns={columns}
                    data={projectReports}
                    totalRecords={totalRecords}
                    loading={loading}
                    empty={empty}
                />
            </React.Fragment>
        );
    }
}

export default ProjectReportsContainer;

ProjectReportsContainer.defaultProps = {
    itemsPerPage: 20
};

// Userchart example
// usersChart: {
//     labels: ['Red', 'Green', 'Yellow'],
//     datasets: [
//         {
//             data: [300, 50, 100],
//             backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
//         }
//     ]
// },
