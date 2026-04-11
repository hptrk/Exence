package com.exence.finance.modules.statistics.entity;

import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetSetting;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.workspace.entity.Workspace;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "widget")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Filter(name = "workspaceFilter", condition = "workspace_id = :workspaceId")
public class Widget {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "widget_id_seq")
    @SequenceGenerator(name = "widget_id_seq", sequenceName = "widget_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private StatisticsWidgetType type;

    @Column(name = "title", nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "timeframe")
    private Timeframe timeframe;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "x")
    private Integer x;

    @Column(name = "y")
    private Integer y;

    @Column(name = "cols")
    private Integer cols;

    @Column(name = "rows")
    private Integer rows;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "settings", columnDefinition = "jsonb")
    private Map<WidgetSetting, Object> settings;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;
}
