{{- define "rick-and-morty.name" -}}
name: {{ .Values.app.name }}
{{- end }}

{{- define "rick-and-morty.namespace" -}}
namespace: {{ .Values.app.namespace }}
{{- end }}

{{- define "rick-and-morty.labels" -}}
app: {{ .Values.app.name }}
environment: {{ .Values.app.environment }}
{{- end }}

{{- define "rick-and-morty.metadata" -}}
name: {{ .Values.app.name }}
namespace: {{ .Values.app.namespace }}
labels:
{{- include "rick-and-morty.labels" . | nindent 2 }}
{{- end }}
