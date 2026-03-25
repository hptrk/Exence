package com.exence.finance.modules.statistics.repository;

import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.entity.Widget;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WidgetRepository extends JpaRepository<Widget, Long> {

    @Query("SELECT w FROM Widget w WHERE w.id = :id")
    Optional<Widget> find(@Param("id") Long id);

    @Query("SELECT w FROM Widget w")
    List<Widget> findAllWidgets();

    Optional<Widget> findFirstByType(WidgetType type);
}
