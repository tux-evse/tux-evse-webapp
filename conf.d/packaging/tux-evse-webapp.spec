%global debug_package %{nil}

Name:           tux-evse-webapp
Version:        1.0
Release:        0%{?dist}
Summary:        WebApp to display Tux-EVSE data

License:        Apache
URL:            https://github.com/tux-evse/tux-evse-webapp
Source0:        %{name}-%{version}.tar.gz
Source1:        webapp-htdocs-prebuild-%{version}.tar.gz

Requires:       afb-binder
Requires:       afb-libpython

BuildArch:      noarch

%description
WebApp to display Tux-EVSE data

%package mock
Requires:       %{name} = %{version}
Summary:        Mock package for %{name}

%description mock
Mock part for webapp Tux-EVSE

%prep
%autosetup -a 1

%build

%install
install -vd  %{buildroot}%{_prefix}/redpesk/%{name}/bin
install -vd  %{buildroot}%{_prefix}/redpesk/%{name}/htdocs
install -vd  %{buildroot}%{_prefix}/redpesk/%{name}/.rpconfig
cp tux-evse-webapp-start.sh %{buildroot}%{_prefix}/redpesk/%{name}/bin/
cp dist/valeo/* %{buildroot}%{_prefix}/redpesk/%{name}/htdocs/
cp conf.d/packaging/manifest-webapp.yml %{buildroot}%{_prefix}/redpesk/%{name}/.rpconfig/manifest.yml

install -vd  %{buildroot}%{_prefix}/redpesk/%{name}-mock/bin
install -vd  %{buildroot}%{_prefix}/redpesk/%{name}-mock/.rpconfig
cp mock/tux-evse-mock-api.py %{buildroot}%{_prefix}/redpesk/%{name}-mock/bin/
cp conf.d/packaging/manifest-mock.yml %{buildroot}%{_prefix}/redpesk/%{name}-mock/.rpconfig/manifest.yml

%files
%dir %{_prefix}/redpesk/%{name}
%{_prefix}/redpesk/%{name}/bin/tux-evse-webapp-start.sh
%{_prefix}/redpesk/%{name}/htdocs
%{_prefix}/redpesk/%{name}/.rpconfig/manifest.yml

%files mock
%dir %{_prefix}/redpesk/%{name}-mock
%{_prefix}/redpesk/%{name}-mock/bin/tux-evse-mock-api.py
%{_prefix}/redpesk/%{name}-mock/.rpconfig/manifest.yml
